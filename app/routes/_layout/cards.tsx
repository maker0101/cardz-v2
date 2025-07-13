import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/cards')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/cards"!</div>
}
