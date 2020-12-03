import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Link from "next/link";
import React, { Children, FC, ReactElement } from "react";

export interface ActiveLinkProps {
	activeClassName: string;
	href: string;
	as?: string;
}

const ActiveLink: FC<ActiveLinkProps> = ({
	children,
	activeClassName,
	...props
}) => {
	const { asPath } = useRouter();
	const child = Children.only(children) as ReactElement;
	const childClassName = child.props.className || "";

	const className =
		asPath === props.href || asPath === props.as
			? `${childClassName} ${activeClassName}`.trim()
			: childClassName;

	return (
		<Link {...props}>
			{React.cloneElement(child, {
				className: className || null,
			})}
		</Link>
	);
};

ActiveLink.propTypes = {
	activeClassName: PropTypes.string.isRequired,
	href: PropTypes.string.isRequired,
	as: PropTypes.string,
};

export default ActiveLink;
