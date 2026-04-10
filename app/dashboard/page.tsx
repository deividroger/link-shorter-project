import { getUserLinks } from '@/data/links';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateLinkDialog } from './create-link-dialog';
import { EditLinkDialog } from './edit-link-dialog';
import { DeleteLinkDialog } from './delete-link-dialog';

export default async function DashboardPage() {
  const links = await getUserLinks();

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Links</h1>
        <CreateLinkDialog />
      </div>
      {links.length === 0 ? (
        <p className="text-muted-foreground">You have no links yet.</p>
      ) : (
        <ul className="space-y-4">
          {links.map((link) => (
            <li key={link.id}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">/{link.slug}</CardTitle>
                    <div className="flex items-center gap-2">
                      <EditLinkDialog link={link} />
                      <DeleteLinkDialog link={link} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:underline break-all"
                  >
                    {link.url}
                  </a>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created {new Date(link.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
