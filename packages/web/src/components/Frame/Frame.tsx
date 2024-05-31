import { useCSSProps } from '../../hooks/style';
import { useI18n } from '../../providers/i18n';
import { useToggle } from '../../signals/toggle';
import type { FrameItem } from '../../types';
import { Omikuji } from '../Omikuji/Omikuji';
import { Video } from '../Video/Video';
import {
  BgImage,
  ExpandCaption,
  FigCaption,
  Figure,
  MainImage,
  OmikujiContainer,
} from './Frame.styles';

interface FrameProps extends FrameItem {}

const CAPTION_LIMIT = 20;

export function Frame({ src, datetime, caption, videoUrl }: FrameProps) {
  const { t, formatDate } = useI18n();
  const [expanded, toggle] = useToggle();
  const omikujiRef = useCSSProps({
    opacity: 1,
    scale: 1,
  });
  const figureRef = useCSSProps({
    scale: 1,
    rotate: 0,
    opacity: 1,
  });

  const isLongCaption = caption.length > CAPTION_LIMIT;
  const shortCaption = caption.slice(0, CAPTION_LIMIT);

  return (
    <>
      <OmikujiContainer ref={omikujiRef}>
        <Omikuji />
      </OmikujiContainer>
      <Figure ref={figureRef}>
        <BgImage src={src} alt="" />
        {videoUrl ? (
          <MainImage as={'div'}>
            <Video src={videoUrl} poster={src} />
          </MainImage>
        ) : (
          <MainImage src={src} alt="" />
        )}

        <FigCaption expanded={expanded.value}>
          <p>
            <time dateTime={datetime}>{formatDate(Date.parse(datetime))}</time>
          </p>
          <p>
            {!isLongCaption || expanded.value ? caption : shortCaption}{' '}
            {isLongCaption && (
              <ExpandCaption
                aria-expanded={expanded}
                type="button"
                onClick={toggle}
              >
                {expanded.value ? t('messages.close') : t('messages.show_more')}
              </ExpandCaption>
            )}
          </p>
        </FigCaption>
      </Figure>
    </>
  );
}
