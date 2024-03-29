"use client";
import React, { FC, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
export const LocalStorageChecker: FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const router = useRouter();
	const path = usePathname();

	useEffect(() => {
		const notification = localStorage.getItem("notification-accepted");

		if (!notification) {
			router.push(`${path}?show=true&step=0`);
		}
	}, [router, path]);

	return <>{children}</>;
};
