import styles from './hand-contact.module.css';

/** Source coordinates refer to the unmodified, 736 × 460 reference image. */
export const REFERENCE_HAND_ART = {
  src: '/assets/editorial/reference-hands.jfif',
  width: 736,
  height: 460,
  robotFingertip: [352, 253],
  humanFingertip: [368, 254],
  contact: [360, 254],
} as const;

type ReferenceHandsProps = {
  className?: string;
  pose?: 'reference' | 'touch';
};

// Robot moves +8px (+1.0869565%) and Human moves -8px (-1.0869565%) to touch at exact center x=360, y=254
const TOUCH_OFFSET = '1.08695652174%';

/**
 * Natural anatomical and mechanical contours that snugly outline each arm,
 * leaving negative space completely open between hands without blunt vertical or horizontal cutoffs.
 */
const ROBOT_CLIP =
  'polygon(0% 55.435%, 10.87% 53.261%, 21.739% 50%, 31.25% 47.826%, 38.723% 48.696%, 42.799% 50.87%, 45.516% 52.609%, 47.826% 55%, 47.554% 56.087%, 45.924% 57.826%, 43.75% 59.13%, 44.565% 63.043%, 44.022% 67.826%, 42.663% 73.913%, 39.13% 79.13%, 32.337% 82.174%, 21.739% 84.348%, 10.87% 86.522%, 0% 89.565%)';

const HUMAN_CLIP =
  'polygon(50% 55.217%, 52.31% 53.043%, 57.065% 50.435%, 63.179% 49.13%, 72.69% 48.696%, 84.239% 51.739%, 100% 58.696%, 100% 85.87%, 86.957% 79.348%, 74.728% 76.087%, 63.859% 73.913%, 57.745% 74.348%, 55.435% 70.652%, 53.261% 66.304%, 51.359% 60.87%, 50.815% 57.609%, 50% 55.652%)';

/** Clips the supplied artwork; neither hand is redrawn, filtered or recolored. */
export function ReferenceHands({ className = '', pose = 'reference' }: ReferenceHandsProps) {
  const touching = pose === 'touch';

  return (
    <div
      className={`${styles.art} ${className}`}
      aria-hidden="true"
      data-reference-hands="original"
    >
      <div className={styles.robot} data-hand="robot">
        <img
          className={styles.sourceImage}
          src={REFERENCE_HAND_ART.src}
          width={REFERENCE_HAND_ART.width}
          height={REFERENCE_HAND_ART.height}
          alt=""
          decoding="async"
          fetchPriority="high"
          data-hand-image="robot"
          data-tip-x="352"
          data-tip-y="253"
          style={{
            clipPath: ROBOT_CLIP,
            transform: touching ? `translateX(${TOUCH_OFFSET})` : undefined,
          }}
        />
      </div>
      <div className={styles.human} data-hand="human">
        <img
          className={styles.sourceImage}
          src={REFERENCE_HAND_ART.src}
          width={REFERENCE_HAND_ART.width}
          height={REFERENCE_HAND_ART.height}
          alt=""
          decoding="async"
          fetchPriority="high"
          data-hand-image="human"
          data-tip-x="368"
          data-tip-y="254"
          style={{
            clipPath: HUMAN_CLIP,
            transform: touching ? `translateX(-${TOUCH_OFFSET})` : undefined,
          }}
        />
      </div>
    </div>
  );
}

export default ReferenceHands;
