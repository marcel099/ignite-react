import { render } from '@testing-library/react'

import { ActiveLink } from '.'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

describe('ActiveLink component', () => {
  it('active link renders correctly', () => {
    const { getByText, debug } = render(
      <ActiveLink href="/" activeClassName="active">
        <a href="#">Home</a>
      </ActiveLink>
    )
  
    expect(getByText('Home')).toBeInTheDocument()
  })
  
  it('adds active class if the link as currenctly active', () => {
    const { getByText, debug } = render(
      <ActiveLink href="/" activeClassName="active">
        <a href="#">Home</a>
      </ActiveLink>
    )
  
    expect(getByText('Home')).toHaveClass('active')
  })
})
