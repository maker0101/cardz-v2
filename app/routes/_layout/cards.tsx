import {createFileRoute} from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/cards')({
  component: CardsPage,
});

function CardsPage() {
  return <div>Hello "/_layout/cards"!</div>;
}
