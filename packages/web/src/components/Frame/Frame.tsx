import { useCSSProps } from '../../hooks/style';
import { useToggle } from '../../hooks/toggle';
import { useI18n } from '../../providers/i18n';
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
  Reloader,
} from './Frame.styles';

interface FrameProps extends FrameItem {
  onClick?: () => void;
}

const CAPTION_LIMIT = 20;

export function Frame({
  src,
  datetime,
  caption,
  onClick = () => {},
  videoUrl,
}: FrameProps) {
  const { t, formatDate } = useI18n();
  const [expanded, toggleExpanded] = useToggle();
  const omikujiRef = useCSSProps({
    opacity: 1,
    scale: 1,
  });
  const imageInRef = useCSSProps({
    scale: 1,
    rotate: 0,
    opacity: 1,
  });
  const bgImageInRef = useCSSProps({
    opacity: 1,
  });

  const captionInRef = useCSSProps({
    opacity: 1,
  });

  const isLongCaption = caption.length > CAPTION_LIMIT;
  const shortCaption = caption.slice(0, CAPTION_LIMIT);

  return (
    <>
      <OmikujiContainer ref={omikujiRef}>
        <Omikuji />
      </OmikujiContainer>
      <Figure>
        <BgImage src={src} alt="" ref={bgImageInRef} />
        {videoUrl ? (
          <MainImage as={'div'} ref={imageInRef}>
            <Video src={videoUrl} poster={src} />
          </MainImage>
        ) : (
          <MainImage src={src} alt="" ref={imageInRef} />
        )}

        <FigCaption ref={captionInRef} expanded={expanded}>
          <p>
            <time dateTime={datetime}>{formatDate(Date.parse(datetime))}</time>
          </p>
          <p>
            {!isLongCaption || expanded ? caption : shortCaption}{' '}
            {isLongCaption && (
              <ExpandCaption
                aria-expanded={expanded}
                type="button"
                onClick={toggleExpanded}
              >
                {expanded ? t('messages.close') : t('messages.show_more')}
              </ExpandCaption>
            )}
          </p>
        </FigCaption>
      </Figure>
      <Reloader onClick={onClick} aria-label={t('messages.reload')} />
    </>
  );
}
