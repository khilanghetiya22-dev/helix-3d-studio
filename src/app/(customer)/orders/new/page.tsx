import { redirect } from 'next/navigation';

/**
 * v14 spec: Since only FDM is offered, skip technology selection entirely.
 * Clicking "New Order" goes directly to the FDM order form.
 */
export default function TechnologySelectionPage() {
  redirect('/orders/new/fdm');
}
