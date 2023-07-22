import Head from 'next/head'
import SequenceTrip from 'components/SequenceTrip'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Triptimizer</title>
      </Head>
      <main className="container">
        <SequenceTrip />
      </main>
    </>
  )
}
