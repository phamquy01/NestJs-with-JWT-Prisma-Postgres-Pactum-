import { ForbiddenException, Injectable } from '@nestjs/common';
import { InsertNoteDTO, UpdateNoteDTO } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}
  getNotes(userId: number) {
    const notes = this.prismaService.note.findMany({
      where: {
        userId,
      },
    });
    return notes;
  }
  async getDetailNotes(noteId: number) {
    const note = await this.prismaService.note.findUnique({
      where: {
        id: noteId,
      },
    });

    if (!note) {
      return new ForbiddenException('Note not found');
    }
    return note;
  }
  async insertNote(userId: number, insetNoteDTO: InsertNoteDTO) {
    const note = await this.prismaService.note.create({
      data: {
        ...insetNoteDTO,
        userId,
      } as any,
    });

    return note;
  }

  async updateNoteById(noteId: number, updateNoteDTO: UpdateNoteDTO) {
    const note = await this.prismaService.note.findUnique({
      where: {
        id: noteId,
      },
    });

    if (!note) {
      return new ForbiddenException('Note not found');
    }

    console.log(note);

    return this.prismaService.note.update({
      where: {
        id: noteId,
      },
      data: { ...updateNoteDTO },
    });
  }
  async deleteNote(noteId: number) {
    const note = await this.prismaService.note.findUnique({
      where: {
        id: noteId,
      },
    });
    if (!note) {
      return new ForbiddenException('Note not found');
    }
    return this.prismaService.note.delete({
      where: {
        id: noteId,
      },
    });
  }
}
