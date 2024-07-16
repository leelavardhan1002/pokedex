import React from 'react';
import ReactSlider, { ReactSliderProps } from 'react-slider';
import cn from 'classnames';

type RangeSliderProps = ReactSliderProps<number | readonly number[]>;

const RangeSlider: React.FC<RangeSliderProps> = ({
  value,
  onChange,
  ...rest
}) => {
  const isVertical = rest.orientation === 'vertical';

  return (
    <ReactSlider
      {...rest}
      value={value}
      onChange={onChange}
      renderTrack={(trackProps, trackState) => {
        const points = Array.isArray(trackState.value)
          ? trackState.value.length
          : null;
        const isMulti = points && points > 0;
        const isLast = isMulti
          ? trackState.index === points
          : trackState.index === 1;
        const isFirst = trackState.index === 0;
        return (
          <div
            {...trackProps}
            className={cn({
              'h-1 top-1/2 -translate-y-1/2': !isVertical,
              'w-2 left-1/2 -translate-x-1/2': isVertical,
              'bg-[#93B2B2]': isMulti ? isFirst || isLast : isLast,
              'bg-SECONDARY': isMulti ? !isFirst || !isLast : isFirst,
            })}
          />
        );
      }}
      renderThumb={(thumbProps, thumbState) => (
        <div {...thumbProps} className="slider-thumb">
          <div className="thumb-label bg-SECONDARY rounded-lg text-[10px] w-7 items-center text-center cursor-pointer">
            {thumbState.valueNow}
          </div>
        </div>
      )}
    />
  );
};

export default RangeSlider;
