import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  create(CreateGenreDto: CreateGenreDto) {
    return this.prisma.genre.create({
      data: CreateGenreDto,
    });
  }

  findAll() {
    return this.prisma.genre.findMany({
      include: {
        books: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.genre.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });
  }

  update(id: number, UpdateGenreDto: UpdateGenreDto) {
    return this.prisma.genre.update({
      where: { id },
      data: UpdateGenreDto,
    });
  }

  remove(id: number) {
    return this.prisma.genre.delete({
      where: { id },
    });
  }
}
