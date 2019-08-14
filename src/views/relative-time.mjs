import { h } from 'preact' /** @jsx h */

import c from 'classnames'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const RelativeTime = (props, context) => {
  const { class: className, datetime, style, ...rest } = props

  if (datetime == null) {
    throw new Error('Prop `datetime` is required')
  }

  const dt = dayjs(datetime)

  return (
    <time
      class={c('b--black', className)}
      style={{
        borderWidth: '0.05em',
        borderBottomStyle: 'dotted',
        ...style
      }}
      title={dt.toString()}
      datetime={dt.toISOString()}
      {...rest}
    >
      {dt.fromNow()}
    </time>
  )
}

export default RelativeTime
