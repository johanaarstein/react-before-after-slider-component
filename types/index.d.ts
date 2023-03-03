import React from 'react';
export declare function isIntersectionObserverSupport(): boolean;
export interface Image {
    imageUrl: string;
    alt?: string;
}
type OnSliderLoadCallback = () => void;
interface Props {
    firstImage: Image;
    secondImage: Image;
    currentPercentPosition?: number;
    className?: string;
    withResizeFeel?: boolean;
    onReady?: OnSliderLoadCallback;
    onVisible?: () => void;
    onChangePercentPosition?: (newPosition: number) => void;
    feelsOnlyTheDelimiter?: boolean;
    delimiterIconStyles?: React.CSSProperties;
    delimiterColor?: string;
}
export default function BeforeAfterSlider({ firstImage, secondImage, className, withResizeFeel, currentPercentPosition, onVisible, onReady, onChangePercentPosition, delimiterIconStyles, feelsOnlyTheDelimiter, delimiterColor, }: Props): JSX.Element;
export {};
