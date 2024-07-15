import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MyJwtAuthGuard } from '../auth/guard';
import { NoteService } from './note.service';
import { GetUser } from '../auth/decorator';
import { InsertNoteDTO, UpdateNoteDTO } from './dto';

@UseGuards(MyJwtAuthGuard)
@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}
  @Get()
  getNotes(@GetUser('id') userId: number) {
    return this.noteService.getNotes(userId);
  }
  @Get(':id')
  getDetailNotes(@Param('id', ParseIntPipe) noteId: number) {
    return this.noteService.getDetailNotes(noteId);
  }
  @Post()
  insertNote(
    @GetUser('id') userId: number,
    @Body() insetNoteDTO: InsertNoteDTO,
  ) {
    return this.noteService.insertNote(userId, insetNoteDTO);
  }
  @Patch(':id')
  updateNote(
    @Param('id', ParseIntPipe) noteId: number,
    @Body() updateNoteDTO: UpdateNoteDTO,
  ) {
    return this.noteService.updateNoteById(noteId, updateNoteDTO);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  deleteNote(@Query('id', ParseIntPipe) noteId: number) {
    return this.noteService.deleteNote(noteId);
  }
}
