const { widget } = figma;
const {
  Frame,
  Rectangle,
  SVG,
  useSyncedState,
  usePropertyMenu,
  useStickableHost
} = widget;

function RaisedIntersectionCreator() {
  const [isRaised, setIsRaised] = useSyncedState<boolean>('raised', false);

  const safeIsToggled = Boolean(isRaised);

  usePropertyMenu(
    [
      {
        itemType: 'toggle',
        propertyName: 'raised',
        tooltip: 'Raised mode',
        isToggled: safeIsToggled
      }
    ],
    ({ propertyName }) => {
      if (propertyName === 'raised') setIsRaised((prev) => !prev);
    }
  );

  useStickableHost();

  const LINE_LENGTH = 100;
  const LINE_THICKNESS = 4;
  const COLOR = '#000000';

  const GAP = 12;
  const ARC_RADIUS = GAP / 2;

  const arcPath = `
    <path d="M ${-ARC_RADIUS * 2},0 
             A ${ARC_RADIUS},${ARC_RADIUS} 0 0 1 ${ARC_RADIUS * 2},0" 
       fill="none" stroke="${COLOR}" stroke-width="${LINE_THICKNESS}" />
  `;
  const strokeMargin = LINE_THICKNESS / 2;
  const arcViewWidth = ARC_RADIUS * 2 + strokeMargin * 2;
  const arcViewHeight = ARC_RADIUS + strokeMargin * 2;
  const arcViewMinX = -ARC_RADIUS - strokeMargin;
  const arcViewMinY = -ARC_RADIUS - strokeMargin;
  const arcSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${arcViewMinX} ${arcViewMinY} ${arcViewWidth} ${arcViewHeight}">
      ${arcPath}
    </svg>
  `;

  const verticalX = (LINE_LENGTH - LINE_THICKNESS) / 2;
  const horizontalY = (LINE_LENGTH - LINE_THICKNESS) / 2;
  const halfGap = GAP / 2;
  const leftSegmentWidth = LINE_LENGTH / 2 - halfGap;
  const rightSegmentWidth = LINE_LENGTH / 2 - halfGap;

  return (
    <Frame width={LINE_LENGTH} height={LINE_LENGTH}>
      <Rectangle
        x={verticalX}
        y={0}
        width={LINE_THICKNESS}
        height={LINE_LENGTH}
        fill={COLOR}
      />
      {isRaised ? (
        <>
          <Rectangle
            x={0}
            y={horizontalY}
            width={leftSegmentWidth}
            height={LINE_THICKNESS}
            fill={COLOR}
          />
          <Rectangle
            x={LINE_LENGTH - rightSegmentWidth}
            y={horizontalY}
            width={rightSegmentWidth}
            height={LINE_THICKNESS}
            fill={COLOR}
          />
          <SVG
            src={arcSvg}
            x={LINE_LENGTH / 2 - ARC_RADIUS}
            y={horizontalY - ARC_RADIUS}
            width={ARC_RADIUS * 2 + LINE_THICKNESS}
            height={ARC_RADIUS + LINE_THICKNESS}
          />
        </>
      ) : (
        <Rectangle
          x={0}
          y={horizontalY}
          width={LINE_LENGTH}
          height={LINE_THICKNESS}
          fill={COLOR}
        />
      )}
    </Frame>
  );
}

widget.register(RaisedIntersectionCreator);

