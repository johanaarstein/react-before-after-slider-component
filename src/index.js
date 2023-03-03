import { createElement, Fragment, useEffect, useMemo, useRef, useState } from 'react'
import './index.scss'
export function isIntersectionObserverSupport() {
    if (typeof window === 'undefined')
        return false
    return Boolean(window.IntersectionObserver)
}
var MODE
(function (MODE) {
    MODE['MOVE'] = 'move'
    MODE['DEFAULT'] = 'default'
})(MODE || (MODE = {}))
function useReadyStatus(imagesWidth, refContainer, onReady) {
    const [isReady, setIsReady] = useState(false)
    const [imagesLoadedCount, setImagesLoadedCount] = useState(0)
    const incrementLoadedImagesCount = () => {
        setImagesLoadedCount(imagesLoadedCount + 1)
    }
    useEffect(() => {
        if (!isReady && imagesLoadedCount === 2 && imagesWidth && refContainer.current) {
            setIsReady(true)
        }
    }, [imagesLoadedCount, imagesWidth, isReady, refContainer.current])
    useEffect(() => {
        if (isReady && onReady) {
            onReady()
        }
    }, [isReady])
    return {
        onImageLoad: incrementLoadedImagesCount,
        isReady,
    }
}
function useInit(updateContainerWidth, onMouseUpHandler) {
    useEffect(() => {
        updateContainerWidth()
        document.addEventListener('click', onMouseUpHandler)
        return () => {
            document.removeEventListener('click', onMouseUpHandler)
        }
    }, [])
}
function useResizeFeel(callback, withResizeFeel) {
    useEffect(() => {
        if (withResizeFeel) {
            window.addEventListener('resize', callback)
        }
        return () => {
            window.removeEventListener('resize', callback)
        }
    }, [])
}
function normalizeNewPosition(newPosition, imagesWidth) {
    if (newPosition > imagesWidth) {
        return imagesWidth
    }
    if (newPosition < 0) {
        return 0
    }
    return newPosition
}
const DEFAULT_START_PERCENT = 50
const DEFAULT_BACKGROUND_COLOR = '#fff'
export default function BeforeAfterSlider({ firstImage, secondImage, className, withResizeFeel = true, currentPercentPosition, onVisible, onReady, onChangePercentPosition, delimiterIconStyles, feelsOnlyTheDelimiter = false, delimiterColor = DEFAULT_BACKGROUND_COLOR, }) {
    const classNames = ['before-after-slider']
    className && classNames.push(className)
    const refContainer = useRef(null)
    const [imagesWidth, setImagesWidth] = useState(null)
    const [delimiterPercentPosition, setDelimiterPosition] = useState(currentPercentPosition
        || DEFAULT_START_PERCENT)
    const [sliderMode, setSliderMode] = useState(MODE.DEFAULT)
    const { onImageLoad, isReady } = useReadyStatus(imagesWidth, refContainer, onReady)
    const [containerPosition, setContainerPosition] = useState({
        top: 0,
        left: 0,
    })
    const onFirstImageLoad = () => {
        updateContainerWidth()
        onImageLoad()
    }
    /**
     * Observer start
     */
    const observerVisiblePercent = 0.95
    const observerOptions = {
        threshold: [0.0, observerVisiblePercent],
    }
    const observerCallback = function (entries) {
        if (!observer || !onVisible)
            return
        entries.forEach(entry => {
            if (entry.intersectionRatio > observerVisiblePercent) {
                observer.disconnect()
                onVisible()
            }
        })
    }
    const [observer] = useState(onVisible && isIntersectionObserverSupport()
        ? new IntersectionObserver(observerCallback, observerOptions)
        : null)
    useEffect(() => {
        if (observer) {
            if (!isReady)
                return
            observer.observe(refContainer.current)
        }
    }, [isReady])
    /**
     * Observer end
     */
    useEffect(() => {
        if (!currentPercentPosition || !imagesWidth) {
            return
        }
        setDelimiterPosition(normalizeNewPosition(currentPercentPosition, imagesWidth))
    }, [currentPercentPosition, imagesWidth])
    const updateContainerWidth = () => {
        if (!refContainer.current)
            return
        const containerWidth = refContainer.current.offsetWidth
        setImagesWidth(containerWidth)
    }
    const onMouseUpHandler = () => {
        setSliderMode(MODE.DEFAULT)
    }
    useInit(updateContainerWidth, onMouseUpHandler)
    const imgStyles = !imagesWidth ? undefined : { width: `${imagesWidth}px` }
    const secondImgContainerStyle = { width: `${delimiterPercentPosition}%` }
    const preparedDelimiterIconStyles = useMemo(() => ({
        backgroundColor: delimiterColor,
        ...(delimiterIconStyles ? delimiterIconStyles : {}),
    }), [delimiterColor, delimiterIconStyles])
    const delimiterStyle = useMemo(() => ({
        left: `${delimiterPercentPosition}%`,
        backgroundColor: delimiterColor,
    }), [delimiterPercentPosition, delimiterColor])
    const updateContainerPosition = () => {
        if (!refContainer.current)
            return
        const containerCoords = refContainer.current.getBoundingClientRect()
        setContainerPosition({
            top: containerCoords.top + pageYOffset,
            left: containerCoords.left + pageXOffset,
        })
    }
    const onMouseDownHandler = () => {
        updateContainerPosition()
        setSliderMode(MODE.MOVE)
    }
    const onMouseMoveHandler = (e) => onMoveHandler(e)
    const onTouchMoveHandler = (e) => {
        onMoveHandler(e.touches[0])
    }
    const onMoveHandler = (e) => {
        if (sliderMode === MODE.MOVE) {
            if (!imagesWidth)
                return
            const X = e.pageX - containerPosition.left
            const newPosition = normalizeNewPosition(X, imagesWidth) / imagesWidth * 100
            onChangePercentPosition
                ? onChangePercentPosition(newPosition)
                : setDelimiterPosition(newPosition)
        }
    }
    useResizeFeel(updateContainerWidth, withResizeFeel)
    const onClickHandlers = {
        onMouseDown: onMouseDownHandler,
        onTouchStart: onMouseDownHandler,
    }
    return (createElement('div', { ref: refContainer, className: classNames.join(' '), onMouseMove: onMouseMoveHandler, onTouchMove: onTouchMoveHandler, onTouchEnd: onMouseUpHandler, onTouchCancel: onMouseUpHandler, ...(!feelsOnlyTheDelimiter ? onClickHandlers : {}) },
        createElement('div', { className: 'before-after-slider__first-photo-container' },
            createElement('img', { src: firstImage.imageUrl, onLoad: onFirstImageLoad, draggable: false, alt: firstImage.alt })),
        Boolean(imagesWidth) && (createElement(Fragment, null,
            createElement('div', { className: 'before-after-slider__second-photo-container', style: secondImgContainerStyle },
                createElement('img', { style: imgStyles, src: secondImage.imageUrl, onLoad: onImageLoad, draggable: false, alt: secondImage.alt })),
            createElement('div', { className: 'before-after-slider__delimiter', style: delimiterStyle, ...feelsOnlyTheDelimiter ? onClickHandlers : {} },
                createElement('div', null,
                    createElement('div', { className: 'before-after-slider__delimiter-icon', style: preparedDelimiterIconStyles })))))))
}
//# sourceMappingURL=index.js.map