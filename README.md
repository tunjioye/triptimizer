<img src="./public/triptimizer-1.jpg" alt="Triptimizer Logo" width="50" height="50" />

# Triptimizer

[Triptimizer](https://test.triptimizer.com) is an innovative web application designed to streamline the process of planning and optimizing your trips. With Triptimizer, you can effortlessly generate the most efficient routes for your journeys, taking into account either the shortest distance or the shortest time to reach multiple destinations.

Gone are the days of manually plotting routes or relying on guesswork to plan your trips. Triptimizer harnesses advanced algorithms and cutting-edge mapping technologies to provide you with optimal routes that save you time, money, and energy.

## Usage

Whether you are planning a road trip, a delivery route, or a series of errands, Triptimizer can handle it all. Simply input your list of addresses, specify your preferences for shortest distance or shortest time, and let Triptimizer do the rest. Within seconds, you will receive a well-organized itinerary that guides you from your starting point to each subsequent destination with maximum efficiency.

At Triptimizer, we understand that time is precious, and inefficient travel routes can quickly become a major frustration. That is why we have developed a powerful solution that takes the hassle out of planning and ensures that you always reach your destinations in the most efficient way possible.

Experience the convenience and power of Triptimizer today.
Start planning your next trip with us and unlock the true potential of efficient travel routing.

Thanks for reading

---

## How to run the project locally

1. Clone the repository
2. Run `pnpm install` to install the dependencies
3. Duplicate `.env.sample` and rename it to `.env.local`
4. Update the environment variables in `.env.local` as needed
5. Run `pnpm dev` to start the development server

## Important Dependencies

1. Google Maps Api Key // Using [Distance Matrix Api](https://developers.google.com/maps/documentation/distance-matrix/distance-matrix) in particular
2. Google Sheets Api Key // To store contact form data // See [google-spreadsheet](https://www.npmjs.com/package/google-spreadsheet) npm package
3. [Vercel KV](https://vercel.com/docs/storage/vercel-kv/kv-reference) // To cache results for public access for 2 days // Using [Upstash KV](https://vercel.com/marketplace/upstash) under the hood
4. [Resend](https://resend.com) // To send emails from the contact form
