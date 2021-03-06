import { Injectable } from '@nestjs/common';
import { CarRepository } from './car.repository';
import { AddCarInput } from './input/add-car.input';
import { EmployeeCarRepository } from '../employee-car/employee-car.repository';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { BaseHttpException } from '../_common/exceptions/base-http-exception';
import { Car } from './schema/car.schema';
import { UpdateCarInput } from './input/update-car.input';
import { ObjectID } from 'mongodb';

@Injectable()
export class CarService {
  constructor(
    private readonly carRepo: CarRepository,
    private readonly employeeCar: EmployeeCarRepository,
    private readonly employee: EmployeeRepository,
  ) {}

  async addCar(input: AddCarInput): Promise<Car> {
    const car = await this.carRepo.addCar(input);
    const employee = await this.employee.getEmployee(input.employee);
    if (!employee) throw new BaseHttpException('EN', 600);
    await this.employeeCar.addEmployeeCar({
      car: car._id,
      employee: employee._id,
    });
    return car;
  }

  async getCars(): Promise<Car[]> {
    return await this.carRepo.getCars();
  }

  async updateCar(input: UpdateCarInput): Promise<Car> {
    const car = await this.carRepo.findOne({ _id: new ObjectID(input.carId) });
    if (!car) throw new BaseHttpException('EN', 601);
    return await this.carRepo.updateCar(input);
  }

  async deleteCar(input: UpdateCarInput): Promise<Car> {
    const car = await this.carRepo.findOne({ _id: new ObjectID(input.carId) });
    if (!car) throw new BaseHttpException('EN', 601);
    return await this.carRepo.deleteCar(input);
  }
}
