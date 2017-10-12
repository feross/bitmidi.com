const { h } = require('preact') /** @jsx h */

const IconLoader = ({
  size = 120,
  fill = '#000'
}) => {
  return (
    <svg
      role='img'
      aria-label='loader'
      width={size}
      height={size}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 100 100'
      preserveAspectRatio='xMidYMid'
      transform='rotate(180)'
    >
      <path d='M34.5,52.4c-0.8,1.4-2.2,1.4-3,0L17.2,27.6C16.4,26.2,17,25,18.7,25h28.6c1.6,0,2.3,1.2,1.5,2.6L34.5,52.4z' fill={fill}>
        <animateTransform attributeName='transform' type='rotate' from='0 33 35' to='120 33 35' repeatCount='indefinite' dur='1s' />
      </path>
      <path d='M68.5,52.4c-0.8,1.4-2.2,1.4-3,0L51.2,27.6C50.4,26.2,51,25,52.7,25h28.6c1.7,0,2.3,1.2,1.5,2.6L68.5,52.4z' fill={fill}>
        <animateTransform attributeName='transform' type='rotate' from='0 67 35' to='120 67 35' repeatCount='indefinite' dur='1s' />
      </path>
      <path d='M51.5,82.4c-0.8,1.4-2.2,1.4-3,0L34.2,57.6C33.4,56.2,34,55,35.7,55h28.6c1.7,0,2.3,1.2,1.5,2.6L51.5,82.4z' fill={fill}>
        <animateTransform attributeName='transform' type='rotate' from='0 50 65' to='120 50 65' repeatCount='indefinite' dur='1s' />
      </path>
    </svg>
  )
}

module.exports = IconLoader
