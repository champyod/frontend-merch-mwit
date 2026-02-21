"use client";

import Loader from "@/components/ui/Loader";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useAdminOverview } from "@/hooks/useAdmin";

export default function DashboardPage() {
	const { user, isLoading } = useAuth();
	const { data: overview } = useAdminOverview(!!user && !isLoading);

	if (isLoading || !user) return <Loader />;

	return (
		<>
			<h1 className="text-2xl pb-1 font-bold">
									Hi <i>{user.name || user.role}</i>
								</h1>			<h2 className="text-3xl font-bold">Admin Panel</h2>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 mb-6">
				<div className="bg-white/10 p-3 rounded-lg border border-white/10">
					<p className="text-xs text-white/60 uppercase">Orders</p>
					<p className="text-xl font-bold text-white">{overview?.total_orders ?? 0}</p>
				</div>
				<div className="bg-white/10 p-3 rounded-lg border border-white/10">
					<p className="text-xs text-white/60 uppercase">Revenue</p>
					<p className="text-xl font-bold text-white">฿{Math.round(overview?.total_revenue ?? 0).toLocaleString()}</p>
				</div>
				<div className="bg-white/10 p-3 rounded-lg border border-white/10">
					<p className="text-xs text-white/60 uppercase">Active Users</p>
					<p className="text-xl font-bold text-white">{overview?.active_users ?? 0}</p>
				</div>
				<div className="bg-white/10 p-3 rounded-lg border border-white/10">
					<p className="text-xs text-white/60 uppercase">Pending</p>
					<p className="text-xl font-bold text-white">{overview?.pending_preorders ?? 0}</p>
				</div>
			</div>
			<h3 className="text-xl pt-10 pb-5 font-bold">
				What&apos;d you like to do today?
			</h3>

			<Link
				className="border-2 border-black bg-white p-2 w-full rounded-lg text-lg hover:drop-shadow-lg flex items-center justify-between"
				href={"/admin/pages"}
			>
				<span>
					Edit my <b>pages</b>.
				</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 1024 1024"
				>
					<path
						fill="currentColor"
						d="M754.752 480H160a32 32 0 1 0 0 64h594.752L521.344 777.344a32 32 0 0 0 45.312 45.312l288-288a32 32 0 0 0 0-45.312l-288-288a32 32 0 1 0-45.312 45.312z"
					/>
				</svg>
			</Link>
			<Link
				className="border-2 border-black bg-white p-2 w-full rounded-lg mt-5 text-lg hover:drop-shadow-lg flex items-center justify-between"
				href={"/admin/products"}
			>
				<span>
					Add/Edit my <b>products</b>.
				</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 1024 1024"
				>
					<path
						fill="currentColor"
						d="M754.752 480H160a32 32 0 1 0 0 64h594.752L521.344 777.344a32 32 0 0 0 45.312 45.312l288-288a32 32 0 0 0 0-45.312l-288-288a32 32 0 1 0-45.312 45.312z"
					/>
				</svg>
			</Link>
			<Link
				className="border-2 border-black bg-white p-2 w-full rounded-lg mt-5 text-lg hover:drop-shadow-lg flex items-center justify-between"
				href={"/admin/preorders"}
			>
				<span>
					Check customers&apos; <b>preorders</b>.
				</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 1024 1024"
				>
					<path
						fill="currentColor"
						d="M754.752 480H160a32 32 0 1 0 0 64h594.752L521.344 777.344a32 32 0 0 0 45.312 45.312l288-288a32 32 0 0 0 0-45.312l-288-288a32 32 0 1 0-45.312 45.312z"
					/>
				</svg>
			</Link>
			<Link
				className="border-2 border-black bg-white p-2 w-full rounded-lg mt-5 text-lg hover:drop-shadow-lg flex items-center justify-between"
				href={"/admin/payments"}
			>
				<span>
					Manage <b>payment accounts</b>.
				</span>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024">
					<path fill="currentColor" d="M754.752 480H160a32 32 0 1 0 0 64h594.752L521.344 777.344a32 32 0 0 0 45.312 45.312l288-288a32 32 0 0 0 0-45.312l-288-288a32 32 0 1 0-45.312 45.312z" />
				</svg>
			</Link>
			<Link
				className="border-2 border-black bg-white p-2 w-full rounded-lg mt-5 text-lg hover:drop-shadow-lg flex items-center justify-between"
				href={"/admin/users"}
			>
				<span>
					View registered <b>users</b>.
				</span>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024">
					<path fill="currentColor" d="M754.752 480H160a32 32 0 1 0 0 64h594.752L521.344 777.344a32 32 0 0 0 45.312 45.312l288-288a32 32 0 0 0 0-45.312l-288-288a32 32 0 1 0-45.312 45.312z" />
				</svg>
			</Link>
			<Link
				className="border-2 border-black bg-white p-2 w-full rounded-lg mt-5 text-lg hover:drop-shadow-lg flex items-center justify-between"
				href={"/admin/settings"}
			>
				<span>
					Check on my site <b>settings</b>.
				</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 1024 1024"
				>
					<path
						fill="currentColor"
						d="M754.752 480H160a32 32 0 1 0 0 64h594.752L521.344 777.344a32 32 0 0 0 45.312 45.312l288-288a32 32 0 0 0 0-45.312l-288-288a32 32 0 1 0-45.312 45.312z"
					/>
				</svg>
			</Link>
		</>
	);
}
