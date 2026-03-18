import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

// Runs daily — checks for deal rooms where:
// 1. Status is reservation_signed AND no contract uploaded within 14 days → fee from listing price
// 2. Buyer hasn't confirmed price within 14 days after seller reported → benefit of doubt, use seller price
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

    const activeDeals = await base44.asServiceRole.entities.DealRoom.filter({ status: 'reservation_signed' });
    const results = { processed: 0, updated: [] };

    for (const deal of activeDeals) {
      const updates = {};
      const logEntries = [...(deal.audit_log || [])];

      // Rule 1: Red flag + no contract uploaded after 14 days → use listing price for fee
      if (deal.red_flag && !deal.contract_url && deal.reservation_signed_at < fourteenDaysAgo) {
        const listing = await base44.asServiceRole.entities.Listing.get(deal.listing_id).catch(() => null);
        if (listing?.price > 0) {
          updates.fee_calculated = Math.round(listing.price * 0.01);
          logEntries.push({
            user_id: 'system',
            action: `Automatický timeout: zmluva nebola nahraná do 14 dní — fee prepočítané z listing ceny €${listing.price.toLocaleString('sk-SK')}`,
            timestamp: now.toISOString()
          });
        }
      }

      // Rule 2: Seller reported price but buyer didn't confirm within 14 days → use seller price
      if (deal.reported_price && !deal.buyer_confirmed_price && deal.reservation_signed_at < fourteenDaysAgo) {
        updates.buyer_confirmed_price = deal.reported_price;
        updates.fee_calculated = Math.round(deal.reported_price * 0.01);
        logEntries.push({
          user_id: 'system',
          action: `Automatický timeout: kupujúci nepotvrdil cenu do 14 dní — akceptovaná cena predávajúceho €${deal.reported_price.toLocaleString('sk-SK')} (benefit of doubt)`,
          timestamp: now.toISOString()
        });

        // Notify admin
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: 'info@stavai.sk',
          subject: `Timeout: kupujúci nepotvrdil cenu — Deal ${deal.id}`,
          body: `Deal Room ID: ${deal.id}\nPredávajúci nahlásil: €${deal.reported_price}\nKupujúci neodpovedal do 14 dní.\nSystém akceptoval cenu predávajúceho (benefit of doubt).`
        }).catch(() => {});
      }

      if (Object.keys(updates).length > 0) {
        updates.audit_log = logEntries;
        await base44.asServiceRole.entities.DealRoom.update(deal.id, updates);
        results.updated.push(deal.id);
        results.processed++;
      }
    }

    return Response.json({ success: true, ...results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});