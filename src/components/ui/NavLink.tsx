import Link from "next/link";
import { Text } from "./primitives";

interface NavLinkProps {
	href: string;
	text: string;
}

const NavLink = ({ href, text }: NavLinkProps) => {
	return (
		<Link
			className="px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/5 group"
			href={href.toLowerCase()}
		>
			<Text 
				size="sm" 
				weight="bold" 
				color="text-white/70" 
				className="group-hover:text-white transition-colors"
			>
				{text}
			</Text>
		</Link>
	);
};

export default NavLink;
