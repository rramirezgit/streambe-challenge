/* eslint-disable @typescript-eslint/indent */
import { useEffect, useRef, useContext } from 'react'
import moment from 'moment'
import Swal from 'sweetalert2'
import { AuthContextTheme } from 'context/Auth'

/**
 *  Este componente se encarga de manejar el tiempo de inactividad del usuario
 */

const TimeOutHandler = (props: any): JSX.Element => {
  const timer = useRef<NodeJS.Timeout | undefined>()
  const { isAuthenticated } = useContext(AuthContextTheme)
  const events = ['click', 'load', 'keydown']

  useEffect(() => {
    addEvents()
    return () => {
      removeEvents()
      clearTimeout(timer.current)
    }
  }, [])

  const eventHandler = (eventType: any): void => {
    console.log(eventType)
    localStorage.setItem(
      'lastInteractionTime',
      moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    )
    if (timer !== undefined) {
      startTimer()
    }
  }

  const showModal = async (): Promise<void> => {
    if (isAuthenticated) {
      await Swal.fire({
        title: 'Session Timeout',
        text: 'Your session has expired. Please login again.',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Login'
      }).then(result => {
        if (result.isConfirmed) {
          props.onLogout()
        } else {
          removeEvents()
          clearTimeout(timer.current)
          props.onLogout()
        }
      })
    }
  }

  const startTimer = (): void => {
    if (timer !== undefined) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(
      () => {
        const lastInteractionTime = localStorage.getItem('lastInteractionTime')
        const diff = moment.duration(moment().diff(moment(lastInteractionTime)))
        const timeOutInterval =
          props.timeOutInterval !== undefined ? props.timeOutInterval : 5000
        clearTimeout(timer.current)
        if (diff.asMilliseconds() < timeOutInterval) {
          startTimer()
        } else {
          showModal().catch(err => {
            console.log(err)
          })
        }
      },
      props.timeOutInterval !== undefined ? props.timeOutInterval : 5000
    )
  }
  const addEvents = (): void => {
    events.forEach(eventName => {
      window.addEventListener(eventName, eventHandler)
    })
    startTimer()
  }

  const removeEvents = (): void => {
    events.forEach(eventName => {
      window.removeEventListener(eventName, eventHandler)
    })
  }

  return <>{props.children}</>
}

export default TimeOutHandler
