import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'
import AppError from '@shared/errors/AppError'

let fakeAppointmentRepository: FakeAppointmentRepository
let createAppointment: CreateAppointmentService

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository()
    createAppointment = new CreateAppointmentService(fakeAppointmentRepository)
  })

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 10).getTime()
    })

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: '123123',
      user_id: '321321'
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('123123')
  })

  it('should not be able to create two appointments at the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 16)

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123',
      user_id: '321321'
    })

    await expect(createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123',
      user_id: '321321'
    })).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 10, 12).getTime()
    })

    await expect(createAppointment.execute({
      date: new Date(2020, 4, 10, 11),
      provider_id: '123123',
      user_id: '321321'

    })).rejects.toBeInstanceOf(AppError)
  })
})
