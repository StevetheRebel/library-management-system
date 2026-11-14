import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresServices: GenresService) {}

  @Post()
  create(@Body() CreateGenreDto: CreateGenreDto) {
    return this.genresServices.create(CreateGenreDto);
  }

  @Get()
  findAll() {
    return this.genresServices.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.genresServices.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateGenreDto: UpdateGenreDto,
  ) {
    return this.genresServices.update(id, UpdateGenreDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.genresServices.remove(id);
  }
}
