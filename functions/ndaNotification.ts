import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { event, data } = await req.json();

  // Only handle NDARequest create events
  if (event?.type !== 'create') {
    return Response.json({ ok: true });
  }

  const ndaRequest = data;
  if (!ndaRequest) {
    return Response.json({ error: 'No data' }, { status: 400 });
  }

  // Fetch listing and requester info
  const [listing, allUsers] = await Promise.all([
    base44.asServiceRole.entities.Listing.get(ndaRequest.listing_id),
    base44.asServiceRole.entities.User.list(),
  ]);

  const seller = allUsers.find(u => u.email === ndaRequest.seller_id || u.id === ndaRequest.seller_id);
  const requester = allUsers.find(u => u.id === ndaRequest.requester_id);

  if (!seller?.email) {
    return Response.json({ error: 'Seller email not found' }, { status: 404 });
  }

  // Send email to seller
  await base44.asServiceRole.integrations.Core.SendEmail({
    to: seller.email,
    subject: `Nová NDA žiadosť – ${listing?.title || 'Off-Market inzerát'}`,
    body: `
Dobrý deň ${seller.full_name || ''},

dostali ste novú žiadosť o NDA prístup k vášmu off-market inzerátu.

📋 Inzerát: ${listing?.title || ndaRequest.listing_id}
👤 Žiadateľ: ${requester?.full_name || 'Neznámy'} (${requester?.email || ''})
📅 Dátum: ${new Date().toLocaleDateString('sk-SK')}

Pre schválenie alebo zamietnutie žiadosti navštívte sekciu NDA Žiadosti vo vašom portáli.

S pozdravom,
tím stavai.sk
    `.trim()
  });

  return Response.json({ ok: true });
});