"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [sampleDataLoading, setSampleDataLoading] = useState(false)
  const { toast } = useToast()

  // Mock settings data
  const [settings, setSettings] = useState({
    storeName: "E-Commerce Store",
    storeDescription: "Your one-stop shop for all your needs",
    contactEmail: "info@ecommerce-store.com",
    contactPhone: "(123) 456-7890",
    shippingCost: "5.99",
    freeShippingThreshold: "50.00",
    taxRate: "8.5",
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
  })

  const createSampleCategories = async () => {
    setSampleDataLoading(true)
    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Sample categories created successfully",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create categories",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to create categories",
        variant: "destructive",
      })
    } finally {
      setSampleDataLoading(false)
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      // In a real application, this would call an API to save the settings
      // const response = await fetch("/api/admin/settings", {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(settings),
      // })
      
      // if (response.ok) {
        toast({
          title: "Success",
          description: "Settings saved successfully",
        })
      // } else {
      //   const error = await response.json()
      //   toast({
      //     title: "Error",
      //     description: error.error || "Failed to save settings",
      //     variant: "destructive",
      //   })
      // }
    } catch {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>
              Basic information about your store
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="store-name">Store Name</Label>
              <Input
                id="store-name"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-description">Store Description</Label>
              <Textarea
                id="store-description"
                value={settings.storeDescription}
                onChange={(e) => setSettings({ ...settings, storeDescription: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Contact Phone</Label>
              <Input
                id="contact-phone"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping & Tax</CardTitle>
            <CardDescription>
              Configure shipping costs and tax rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shipping-cost">Standard Shipping Cost ($)</Label>
              <Input
                id="shipping-cost"
                type="number"
                step="0.01"
                value={settings.shippingCost}
                onChange={(e) => setSettings({ ...settings, shippingCost: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="free-shipping-threshold">Free Shipping Threshold ($)</Label>
              <Input
                id="free-shipping-threshold"
                type="number"
                step="0.01"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Tax Rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                step="0.1"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Settings</CardTitle>
            <CardDescription>
              Configure user registration and authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow User Registration</Label>
                <p className="text-sm text-muted-foreground">
                  Allow new users to register accounts
                </p>
              </div>
              <Switch
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">
                  Require users to verify their email address
                </p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance</CardTitle>
            <CardDescription>
              Control store availability and sample data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable the store for maintenance
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>
            
            <div className="pt-4">
              <Label>Sample Data</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Create sample categories for testing
              </p>
              <Button onClick={createSampleCategories} disabled={sampleDataLoading}>
                {sampleDataLoading ? "Creating..." : "Create Sample Categories"}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                This will create sample categories: Electronics, Clothing, Books, Home & Garden, Sports
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}