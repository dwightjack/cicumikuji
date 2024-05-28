import { useState } from 'preact/hooks';
import { useCSSProps } from '../../hooks/style';
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

export function Frame({
  src,
  datetime,
  caption,
  onClick = () => {},
  videoUrl,
}: FrameProps) {
  const { t, formatDate } = useI18n();
  const [expanded, setExpanded] = useState(false);
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

  const isLongCaption = caption.length > 0;

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
            {isLongCaption ? (
              <>
                {`${caption.slice(0, 20)} `}
                <ExpandCaption
                  hidden={expanded || !isLongCaption}
                  type="button"
                  onClick={() => setExpanded(true)}
                >
                  もっと見る...
                </ExpandCaption>
              </>
            ) : (
              caption
            )}{' '}
          </p>
        </FigCaption>
      </Figure>
      <Reloader onClick={onClick} aria-label={t('messages.reload')} />
    </>
  );
}
