import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/humanitarian/$slug')({
  component: () => <Outlet />,
})
