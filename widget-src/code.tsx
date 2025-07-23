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
  // Synced state for whether the raised mode is on (shared across all users in multiplayer)
  const [isRaised, setIsRaised] = useSyncedState<boolean>('raised', false);

  // 1. Give the validator a GUARANTEED boolean
  const safeIsToggled = Boolean(isRaised); // null → false

  // 2. Hand a fully-typed item to usePropertyMenu
  usePropertyMenu(
    [
      {
        itemType: 'toggle',
        propertyName: 'raised',
        tooltip: 'Raised mode',
        isToggled: safeIsToggled // must be boolean at first paint
      }
    ],
    ({ propertyName }) => {
      if (propertyName === 'raised') setIsRaised((prev) => !prev);
    }
  );

  // Use the stickable host hook so connectors snap to this widget (FigJam only)
  useStickableHost();

  // Dimensions and styling for the lines and arc
  const LINE_LENGTH = 100; // total length of each line (px)
  const LINE_THICKNESS = 4; // thickness of lines (px)
  const COLOR = '#000000'; // line color (black by default, can be changed)

  // For raised mode: define horizontal segments and arc geometry
  const GAP = 12; // gap in the middle of horizontal line for the arc (px)
  const ARC_RADIUS = GAP / 2; // radius for the half-circle arc (half the gap)

  // Construct SVG path for the half-circle arc bridging the gap.
  // Using an arc sweep of 180° (half circle) from (-GAP/2, 0) to (GAP/2, 0), going upwards.
  const arcPath = `
    <path d="M ${-ARC_RADIUS * 2},0 
             A ${ARC_RADIUS},${ARC_RADIUS} 0 0 1 ${ARC_RADIUS * 2},0" 
       fill="none" stroke="${COLOR}" stroke-width="${LINE_THICKNESS}" />
  `;
  // We include a small margin in the viewBox to account for stroke thickness so the arc isn’t clipped.
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

  // Determine positions for the line segments:
  // Vertical line: centered horizontally in the frame.
  const verticalX = (LINE_LENGTH - LINE_THICKNESS) / 2;
  // Horizontal line(s): centered vertically in the frame.
  const horizontalY = (LINE_LENGTH - LINE_THICKNESS) / 2;
  // For raised mode, left segment from 0 to (center - GAP/2), right from (center + GAP/2) to end.
  const halfGap = GAP / 2;
  const leftSegmentWidth = LINE_LENGTH / 2 - halfGap;
  const rightSegmentWidth = LINE_LENGTH / 2 - halfGap;

  return (
    <Frame width={LINE_LENGTH} height={LINE_LENGTH}>
      {/* Vertical line (always rendered) */}
      <Rectangle
        x={verticalX}
        y={0}
        width={LINE_THICKNESS}
        height={LINE_LENGTH}
        fill={COLOR}
      />
      {isRaised ? (
        /* Raised mode: two horizontal segments + arc */
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
          {/* Arc SVG bridging the gap, positioned above the horizontal center */}
          <SVG
            src={arcSvg}
            // Position the SVG so that its baseline (y=0 in SVG coords) aligns with the horizontal line’s center
            x={LINE_LENGTH / 2 - ARC_RADIUS}
            y={horizontalY - ARC_RADIUS}
            width={ARC_RADIUS * 2 + LINE_THICKNESS}
            height={ARC_RADIUS + LINE_THICKNESS}
          />
        </>
      ) : (
        /* Regular mode: one full horizontal line */
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

