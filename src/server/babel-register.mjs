// Server should be running as www-data by the time babel-register runs, since it
// reads/writes a .cache folder and it should be deleteable.
import babelRegister from '@babel/register'

// Automatically compile view files with babel (for JSX)
babelRegister({ only: [/views/, /lib/], extensions: ['.js', '.mjs'], cache: false })
