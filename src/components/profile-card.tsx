'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

export default function ProfileCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Your information at a glance.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback>
                            <User className="h-8 w-8" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-lg">Guest User</p>
                        <p className="text-sm text-muted-foreground">Ongur, India</p>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-sm">Member Since</h4>
                    <p className="text-muted-foreground text-sm">January 2024</p>
                </div>
            </CardContent>
        </Card>
    );
}
