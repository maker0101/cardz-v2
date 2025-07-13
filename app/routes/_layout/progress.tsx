import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/progress')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/progress"!</div>
}
