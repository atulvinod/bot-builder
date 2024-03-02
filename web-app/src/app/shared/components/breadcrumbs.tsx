"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
    "use client";
    const pathName = usePathname();

    const segments = pathName.split("/").filter((path) => path);
    segments.pop();

    const segmentComponents = segments.reduce(
        (
            agg: { current_url: string; segments: React.ReactElement[] },
            urlComponent,
            idx
        ) => {
            agg.current_url += "/" + urlComponent;

            agg.segments.push(
                <div key={idx} className="flex items-center ">
                    <span className="text-gray-400 mx-2"> / </span>
                    <Link href={agg.current_url}>
                        <span className="border rounded-sm p-1 px-2 capitalize">
                            {urlComponent}
                        </span>
                    </Link>
                </div>
            );
            return agg;
        },
        { current_url: "", segments: [] }
    );

    return <div className="ml-5 flex">{...segmentComponents.segments}</div>;
}
