import Link from 'next/link'

const StaticNavbar=()=>(
    <div className="w-full bg-gray-950  p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-4xl md:text-5xl text-white"><Link href="/">Nick R &middot; Web Dev</Link></p>
        </div>
    </div>
)

export default StaticNavbar