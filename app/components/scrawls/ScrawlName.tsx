"use client";
import { YYYYMMDD } from "@/app/lib/dayJs";
import { Scrawl } from "@prisma/client";
import { IconMist, IconPencil } from "@tabler/icons-react";
import { useState } from "react";
import { renameScrawl } from "@/app/lib/actions";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import { ToolTipWrapper } from "../ui/TooltipWrapper";

export const ScrawlName = ({ scrawl }: { scrawl: Scrawl }) => {
	const [editable, setEditable] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const { theme } = useTheme();

	function calcTimeSpent() {
		let snoozeTime = scrawl.snoozedCount * 5;
		return scrawl.mode + snoozeTime;
	}

	async function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.value === scrawl.name) {
			setEditable(false);
			return;
		}

		setIsSaving(true);
		await renameScrawl(scrawl.id, e.target.value)
			.then(() => {
				toast.success("Scrawl name updated!", {
					style: {
						fontSize: "0.75rem",
						background: theme === "light" ? "#151414" : "#d0d0d0",
						color: theme === "light" ? "#d0d0d0" : "#151414",
					},
				});
			})
			.catch(() => {
				toast.error("Something went wrong! Please try again.", {
					style: {
						fontSize: "0.75rem",
						background: theme === "light" ? "#151414" : "#d0d0d0",
						color: theme === "light" ? "#d0d0d0" : "#151414",
					},
				});
			});

		setEditable(false);
		setIsSaving(false);
	}

	return (
		<section className="flex justify-between w-full grow relative">
			<div className="flex gap-4 items-center text-stone-600 dark:text-stone-500">
				<IconMist size={20} />
				{editable ? (
					<input
						type="text"
						className="text-sm font-semibold bg-transparent"
						defaultValue={
							scrawl.name ? scrawl.name : YYYYMMDD(scrawl.completedAt)
						}
						autoFocus
						onBlur={handleNameChange}
						disabled={isSaving}
					/>
				) : (
					<p className="text-sm font-semibold">
						{scrawl.name ? scrawl.name : YYYYMMDD(scrawl.completedAt)}
					</p>
				)}
			</div>
			<ToolTipWrapper label="Edit name">
				<button
					className={`p-1.5 rounded-md bg-primary-500 text-background dark:text-textDark hover:bg-hoverLight dark:hover:bg-hoverDark duration-300 transition-all ease-in-out`}
					onClick={() => {
						setEditable(!editable);
					}}
				>
					<IconPencil
						size={16}
						className="text-stone-600 dark:text-stone-500"
					/>
				</button>
			</ToolTipWrapper>
			<span className="text-background dark:text-text absolute text-xs font-bold -bottom-0.5 left-3.5">
				{calcTimeSpent()}
			</span>
		</section>
	);
};
