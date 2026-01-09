import { Student } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';

interface StudentListProps {
    students: Student[];
    loading: boolean;
    onDelete: (student: Student) => void;
}

export default function StudentList({ students, loading, onDelete }: StudentListProps) {
    if (loading) {
        return (
            <div className="py-12 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (students.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Nenhum aluno cadastrado</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Desktop Table */}
            <div className="hidden md:block border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Série</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell className="font-medium">{student.id}</TableCell>
                                <TableCell>{student.nome}</TableCell>
                                <TableCell>{student.email}</TableCell>
                                <TableCell>{student.serie}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(student)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {students.map((student) => (
                    <Card key={student.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                ID: {student.id}
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(student)}
                                className="text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold">{student.nome}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                📧 {student.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                📚 {student.serie}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
