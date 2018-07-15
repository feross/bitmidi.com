import { h } from 'preact' /** @jsx h */

import c from 'classnames'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const RelativeTime = (props, context) => {
  const { mainColor } = context.theme
  const { time, class: className, ...rest } = props

  const datetime = dayjs(time)
  return (
    <time
      class={c(`b--${mainColor}`, className)}
      style={{
        borderWidth: '0.05em',
        borderBottomStyle: 'dotted'
      }}
      title={datetime.toString()}
      datetime={datetime.toISOString()}
      {...rest}
    >
      {datetime.fromNow()}
    </time>
  )
}

export default RelativeTime
