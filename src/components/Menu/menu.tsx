import React, { FC, createContext, useState } from 'react'
import classNames from 'classnames'
import { MenuItemProps } from './menuItem'
import { SubMenuProps } from './subMenu'

type MenuMode = 'horizontal' | 'vertical'

export interface MenuProps {
  /**
   * 展示模式，纵向模式和水平模式
   */
  mode?: MenuMode;
  /**
   * 默认active的MenuItem
   */
  defaultIndex?: string;
  /**
   * 自定义样式
   */
  className?: string;
  /**
   * 展开子菜单，只对纵向模式生效
   */
  defaultOpenSubMenus?: string[]
  /**
   * 点击MenuItem时回调
   */ 
  onSelect?: (index: string) => void;
}

export interface IMenuContext {
  index: string;
  onSelect?: (index: string) => void;
  mode?: MenuMode;
  defaultOpenSubMenus?: string[]
}

export const MenuContext = createContext<IMenuContext>({index: '0'})

export const Menu: FC<MenuProps> = (props) => {
  const { defaultIndex, mode, children, className, onSelect, defaultOpenSubMenus, ...resProps } = props
  const [ currentActive, setActive ] = useState(defaultIndex)

  const classes = classNames('cola-menu', className, {
    'menu-vertical': mode === 'vertical',
    'menu-horizontal': mode !== 'vertical',
  })

  const handleClick = (index: string) => {
    setActive(index)
    if(onSelect) {
      onSelect(index)
    }
  }

  const passedContext: IMenuContext = {
    index: currentActive ? currentActive : '0',
    onSelect: handleClick,
    mode,
    defaultOpenSubMenus
  }

  const renderChildren = () => {
    // 不要再children上直接使用map，
    // 使用React.Children.map(children, function[(thisArg)])
    return React.Children.map(children, (child, index) => {
      // 断言获取diaplayName
      const childEl = child as React.FunctionComponentElement<MenuItemProps | SubMenuProps>
      const { displayName } = childEl.type
      if (displayName === 'MenuItem' || displayName === 'SubMenu') {
        return React.cloneElement(childEl, { index: index.toString() })
      } else {
        console.error('Warning: Menu has a child which is nost a MenuItem or SubMenu compoment.')
      }
    })
  }
  return(
    <ul className={classes}  data-testid="test-menu" {...resProps}>
      <MenuContext.Provider value={passedContext}>
        {renderChildren()}
      </MenuContext.Provider>
    </ul>
  )
}

Menu.defaultProps = {
  defaultIndex: '0',
  mode: 'horizontal',
  defaultOpenSubMenus: [],
}

export default Menu;