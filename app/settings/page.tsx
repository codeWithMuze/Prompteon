'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '../../components/Layout';
import { useAuth } from '../../components/AuthProvider';
import { SettingsLayout } from '../../components/settings/SettingsLayout';
import { ProfileForm } from '../../components/settings/ProfileForm';
import { SecurityForm } from '../../components/settings/SecurityForm';
import { PreferencesForm } from '../../components/settings/PreferencesForm';
import { DeleteAccount } from '../../components/settings/DeleteAccount';
import { PromptHistoryItem } from '../../types';
import { fetchUserHistory } from '../../services/historyService';

export default function SettingsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'preferences' | 'account'>('profile');
    const [history, setHistory] = useState<PromptHistoryItem[]>([]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
        } else if (user) {
            fetchUserHistory(user.id).then(setHistory);
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-[#05060a] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-tactical-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const renderSection = () => {
        switch (activeSection) {
            case 'profile': return <ProfileForm />;
            case 'security': return <SecurityForm />;
            case 'preferences': return <PreferencesForm />;
            case 'account': return <DeleteAccount />;
            default: return <ProfileForm />;
        }
    };

    return (
        <Layout
            history={history}
            onSignInClick={() => { }}
        >
            <div className="max-w-7xl mx-auto py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Settings</h1>
                    <p className="text-zinc-400">Manage your account preferences and security.</p>
                </div>

                <SettingsLayout
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                >
                    {renderSection()}
                </SettingsLayout>
            </div>
        </Layout>
    );
}
