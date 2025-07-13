import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/study')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/study"!</div>
}
