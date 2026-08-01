import {NavigationBar} from './NavigationBar'
import {MainContents} from './MainContents'

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface">
      <NavigationBar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <MainContents />
      </main>
    </div>
  )
}
