// ** React Imports
import { Link } from 'react-router-dom'
import React, { Fragment } from 'react'

// ** Third Party Components
import * as Icon from 'react-feather'
//import Select, { components } from 'react-select'
//import classnames from 'classnames'

// ** Custom Component
import Autocomplete from '@components/autocomplete'
import { handleMenuHidden } from '@store/layout'

// ** Reactstrap Imports
import {
  NavItem,
  NavLink
  //Button
  // DropdownMenu,
  // DropdownItem,
  // DropdownToggle,
  // UncontrolledTooltip,
  // UncontrolledDropdown
} from 'reactstrap'

// ** Store & Actions
import {
  useDispatch
  //,useSelector
} from 'react-redux'
import {
  //,updateBookmarked, 
  // handleSearchQuery 
} from '@store/navbar'

// ** Utils
//import { selectThemeColors } from '@utils'
//import axios from 'axios'

const NavbarBookmarks = props => {
  const dispatch = useDispatch()
  // const [selectedCustomer, setSelectedCustomer] = useState({})
  // const [CustomerList, setCustomerList] = useState(null)
  // const [options, setOptions] = useState([
  //   {
  //     value: 'add-new',
  //     label: 'Add New Customer',
  //     type: 'button',
  //     color: 'flat-success'
  //   }
  // ])
  // ** Props
  const { setMenuVisibility, menuVisibility } = props

  // ** State
  // const [value, setValue] = useState('')
  // const [openSearch, setOpenSearch] = useState(false)

  // ** Store Vars
  //const dispatch = useDispatch()
  //const store = useSelector(state => state.navbar)

  // ** ComponentDidMount
  // useEffect(() => {
  //   dispatch(getBookmarks())
  // }, [])

  // useEffect(() => {

  //   // ** Get CustomerList
  //   axios.get('/api/invoice/clients').then(response => {
  //     const arr = options
  //     response.data.map(item => arr.push({ value: item.name, label: item.name }))
  //     setOptions([...arr])
  //     setCustomerList(response.data)
  //   })
  // }, [])

  // ** Removes query in store
  //const handleClearQueryInStore = () => dispatch(handleSearchQuery(''))

  // // ** Loops through Bookmarks Array to return Bookmarks
  // const onKeyDown = e => {
  //   if (e.keyCode === 27 || e.keyCode === 13) {
  //     setTimeout(() => {
  //       setOpenSearch(false)
  //       handleClearQueryInStore()
  //     }, 1)
  //   }
  // }

  // // ** Function to toggle Bookmarks
  // const handleBookmarkUpdate = id => dispatch(updateBookmarked(id))

  // // ** Function to handle Bookmarks visibility
  // const handleBookmarkVisibility = () => {
  //   setOpenSearch(!openSearch)
  //   setValue('')
  //   handleClearQueryInStore()
  // }

  // // ** Function to handle Input change
  // const handleInputChange = e => {
  //   setValue(e.target.value)
  //   dispatch(handleSearchQuery(e.target.value))
  // }

  // // ** Function to handle external Input click
  // const handleExternalClick = () => {
  //   if (openSearch === true) {
  //     setOpenSearch(false)
  //     handleClearQueryInStore()
  //   }
  // }

  // // ** Function to clear input value
  // const handleClearInput = setUserInput => {
  //   if (!openSearch) {
  //     setUserInput('')
  //     handleClearQueryInStore()
  //   }
  // }

  // ** Custom Options Component
  //  const OptionComponent = ({ data, ...props }) => {
  //   if (data.type === 'button') {
  //     return (
  //       <Button className='text-start rounded-0 px-50' color={data.color} block onClick={() => setOpen(true)}>
  //         <Icon.Plus className='font-medium-1 me-50' />
  //         <span className='align-middle'>{data.label}</span>
  //       </Button>
  //     )
  //   } else {
  //     return <components.Option {...props}> {data.label} </components.Option>
  //   }
  // }


  // ** Invoice To OnChange
  // const handleInvoiceToChange = data => {
  //   setSelectedCustomer(data)
  //   setSelected(CustomerList.filter(i => i.name === data.value)[0])
  // }

  return (
    <Fragment>
      <ul className='navbar-nav d-xl-none'>
        <NavItem className='mobile-menu me-auto'>
          <NavLink className='nav-menu-main menu-toggle hidden-xs is-active' onClick={() => { setMenuVisibility(!menuVisibility); dispatch(handleMenuHidden(false)) }}>
            <Icon.Menu className='ficon' />
          </NavLink>
        </NavItem>
      </ul>
      {/* <ul className='nav navbar-nav bookmark-icons'>
        <NavItem className='nav-item d-none d-lg-block'>
          <NavLink className='bookmark-star' onClick={handleBookmarkVisibility}>
            <Icon.Star className='ficon text-warning' />
          </NavLink>
          <div className={classnames('bookmark-input search-input', { show: openSearch })}>
            <div className='bookmark-input-icon'>
              <Icon.Search size={14} />
            </div>
            {openSearch && store.suggestions.length ? (
              <Autocomplete
                wrapperClass={classnames('search-list search-list-bookmark', {
                  show: openSearch
                })}
                className='form-control'
                suggestions={!value.length ? store.bookmarks : store.suggestions}
                filterKey='title'
                autoFocus={true}
                defaultSuggestions
                suggestionLimit={!value.length ? store.bookmarks.length : 6}
                placeholder='Search...'
                externalClick={handleExternalClick}
                clearInput={(userInput, setUserInput) => handleClearInput(setUserInput)}
                onKeyDown={onKeyDown}
                value={value}
                onChange={handleInputChange}
                customRender={(
                  item,
                  i,
                  filteredData,
                  activeSuggestion,
                  onSuggestionItemClick,
                  onSuggestionItemHover
                ) => {
                  const IconTag = Icon[item.icon ? item.icon : 'X']
                  return (
                    <li
                      key={i}
                      onMouseEnter={() => onSuggestionItemHover(filteredData.indexOf(item))}
                      className={classnames('suggestion-item d-flex align-items-center justify-content-between', {
                        active: filteredData.indexOf(item) === activeSuggestion
                      })}
                    >
                      <Link
                        to={item.link}
                        className='d-flex align-items-center justify-content-between p-0'
                        onClick={() => {
                          setOpenSearch(false)
                          handleClearQueryInStore()
                        }}
                        style={{
                          width: 'calc(90%)'
                        }}
                      >
                        <div className='d-flex justify-content-start align-items-center overflow-hidden'>
                          <IconTag size={17.5} className='me-75' />
                          <span className='text-truncate'>{item.title}</span>
                        </div>
                      </Link>
                      <Icon.Star
                        size={17.5}
                        className={classnames('bookmark-icon float-end', {
                          'text-warning': item.isBookmarked
                        })}
                        onClick={() => handleBookmarkUpdate(item.id)}
                      />
                    </li>
                  )
                }}
              />
            ) : null}
          </div>
        </NavItem>
      </ul> */}
    </Fragment>
  )
}

export default NavbarBookmarks
