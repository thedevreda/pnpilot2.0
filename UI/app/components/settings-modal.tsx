"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { User, Key, Edit, Save, X, CheckCircle, AlertCircle, Eye, EyeOff, Shield, Settings } from "lucide-react"

interface PlatformAccount {
  id: string
  name: string
  username: string
  password: string
  status: "connected" | "disconnected" | "error"
  lastLogin: string
  color: string
}

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [accounts, setAccounts] = useState<PlatformAccount[]>([
    {
      id: "partbase",
      name: "Partbase",
      username: "user@company.com",
      password: "••••••••",
      status: "connected",
      lastLogin: "2024-01-15 10:30 AM",
      color: "bg-green-500",
    },
    {
      id: "ils",
      name: "ILS",
      username: "aviation_user",
      password: "••••••••",
      status: "connected",
      lastLogin: "2024-01-15 09:45 AM",
      color: "bg-blue-500",
    },
    {
      id: "locatory",
      name: "Locatory",
      username: "",
      password: "",
      status: "disconnected",
      lastLogin: "Never",
      color: "bg-purple-500",
    },
    {
      id: "avitrader",
      name: "AviTrader",
      username: "trader123",
      password: "••••••••",
      status: "error",
      lastLogin: "2024-01-14 03:20 PM",
      color: "bg-orange-500",
    },
    {
      id: "aircraft24",
      name: "Aircraft24",
      username: "parts_buyer",
      password: "••••••••",
      status: "connected",
      lastLogin: "2024-01-15 11:15 AM",
      color: "bg-teal-500",
    },
  ])

  const [editingAccount, setEditingAccount] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({})
  const [testingConnection, setTestingConnection] = useState<string | null>(null)

  const handleEdit = (account: PlatformAccount) => {
    setEditingAccount(account.id)
    setEditForm({
      username: account.username,
      password: account.password === "••••••••" ? "" : account.password,
    })
  }

  const handleSave = async (accountId: string) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId
          ? {
              ...account,
              username: editForm.username,
              password: editForm.password || "••••••••",
              status: editForm.username && editForm.password ? "connected" : "disconnected",
            }
          : account,
      ),
    )
    setEditingAccount(null)
    setEditForm({ username: "", password: "" })
  }

  const handleCancel = () => {
    setEditingAccount(null)
    setEditForm({ username: "", password: "" })
  }

  const handleTestConnection = async (accountId: string) => {
    setTestingConnection(accountId)

    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId
          ? {
              ...account,
              status: Math.random() > 0.3 ? "connected" : "error",
              lastLogin: account.username ? new Date().toLocaleString() : "Never",
            }
          : account,
      ),
    )
    setTestingConnection(null)
  }

  const togglePasswordVisibility = (accountId: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        )
      case "error":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <AlertCircle className="h-3 w-3 mr-1" />
            Disconnected
          </Badge>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            PNPilot Settings
          </DialogTitle>
          <DialogDescription>Manage your platform accounts and application settings</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="accounts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="accounts" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Account Manager
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  Platform Accounts
                </CardTitle>
                <CardDescription>
                  Manage login credentials for each platform. These credentials are used by the scraper to access
                  platform data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6 bg-blue-50 border-blue-200">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    All credentials are encrypted and stored securely. They are only used for automated scraping
                    operations.
                  </AlertDescription>
                </Alert>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Platform</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Password</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${account.color}`} />
                              <span className="font-medium">{account.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {editingAccount === account.id ? (
                              <Input
                                value={editForm.username}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, username: e.target.value }))}
                                placeholder="Enter username"
                                className="w-full"
                              />
                            ) : (
                              <span className="text-slate-600">
                                {account.username || <span className="text-slate-400 italic">Not configured</span>}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingAccount === account.id ? (
                              <div className="flex items-center space-x-2">
                                <Input
                                  type={showPassword[account.id] ? "text" : "password"}
                                  value={editForm.password}
                                  onChange={(e) => setEditForm((prev) => ({ ...prev, password: e.target.value }))}
                                  placeholder="Enter password"
                                  className="flex-1"
                                />
                                <Button variant="ghost" size="sm" onClick={() => togglePasswordVisibility(account.id)}>
                                  {showPassword[account.id] ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            ) : (
                              <span className="text-slate-600">
                                {account.password || <span className="text-slate-400 italic">Not configured</span>}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(account.status)}</TableCell>
                          <TableCell>
                            <span className="text-sm text-slate-500">{account.lastLogin}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {editingAccount === account.id ? (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleSave(account.id)}
                                    disabled={!editForm.username || !editForm.password}
                                  >
                                    <Save className="h-3 w-3 mr-1" />
                                    Save
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={handleCancel}>
                                    <X className="h-3 w-3 mr-1" />
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button size="sm" variant="ghost" onClick={() => handleEdit(account)}>
                                    <Edit className="h-3 w-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleTestConnection(account.id)}
                                    disabled={
                                      !account.username ||
                                      !account.password ||
                                      account.password === "••••••••" ||
                                      testingConnection === account.id
                                    }
                                  >
                                    {testingConnection === account.id ? "Testing..." : "Test"}
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Account Status Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {accounts.filter((a) => a.status === "connected").length}
                      </div>
                      <div className="text-slate-600">Connected</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {accounts.filter((a) => a.status === "error").length}
                      </div>
                      <div className="text-slate-600">Errors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-600">
                        {accounts.filter((a) => a.status === "disconnected").length}
                      </div>
                      <div className="text-slate-600">Not Configured</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security and encryption settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>Security features will be implemented in future updates.</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure general application preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>General settings will be implemented in future updates.</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
