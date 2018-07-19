import { h } from 'preact' /** @jsx h */

export const HorizListItem = ({ children }) => {
  return <div class='dib nowrap'>{children}</div>
}

export const HorizListDivider = () => {
  return <span class='mh2'>•</span>
}
