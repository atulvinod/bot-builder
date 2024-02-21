import { ComponentProps, ElementType, ReactElement } from "react";
import sparking from "../../../svgs/sparkling.svg";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Loader2 } from "lucide-react";

export enum ButtonVariants {
    Magic,
    Muted,
    Danger,
    Loading,
}

export enum ButtonSize {
    Normal,
    Small,
    MaxHeight,
}

function getSVGIcon(source: string | StaticImport) {
    return (
        <Image
            alt="sparking_svg"
            src={source}
            width={15}
            height={15}
            className="mr-2"
        ></Image>
    );
}

export type variantConfig = {
    textColor: string;
    bgColor: string;
    icon?: ReactElement;
};
const buttonVariants: {
    [key: string]: variantConfig;
} = {
    [ButtonVariants.Magic]: {
        bgColor: "appParrot",
        textColor: "#000000",
        icon: getSVGIcon(sparking),
    },
    [ButtonVariants.Muted]: {
        bgColor: "appGrey",
        textColor: "#000000",
    },
    [ButtonVariants.Danger]: {
        bgColor: "appDangerRed",
        textColor: "#000000",
    },
    [ButtonVariants.Loading]: {
        bgColor: "yellow-100",
        textColor: "#000000",
        icon: <Loader2 className="mr-2 h-4 w-4 animate-spin" />,
    },
};

export type sizeConfig = {
    height: string;
};
const buttonSizeConfigs = {
    [ButtonSize.Normal]: {
        height: "h-11",
    },
    [ButtonSize.Small]: {
        height: "h-8",
    },
    [ButtonSize.MaxHeight]: {
        height: "h-full",
    },
};

export function Button({
    buttonText,
    variant = ButtonVariants.Muted,
    size = ButtonSize.Normal,
    icon,
    type = "button",
    variantConfigOverrides,
    sizeConfigOverrides,
    ...props
}: {
    buttonText?: string;
    variant?: ButtonVariants;
    size?: ButtonSize;
    icon?: ReactElement;
    type?: "button" | "submit" | "reset" | undefined;
    variantConfigOverrides?: variantConfig;
    sizeConfigOverrides?: sizeConfig;
}) {
    const style = {
        ...buttonVariants[variant],
        ...(variantConfigOverrides ?? {}),
    };
    const dimensions = {
        ...buttonSizeConfigs[size],
        ...(sizeConfigOverrides ?? {}),
    };
    return (
        <button
            type={type}
            className={`bg-${style.bgColor} text-[${style.textColor}] ${dimensions.height} px-5 rounded-full flex flex-row items-center`}
            {...props}
        >
            {icon ?? style.icon}
            <span>{buttonText}</span>
        </button>
    );
}
