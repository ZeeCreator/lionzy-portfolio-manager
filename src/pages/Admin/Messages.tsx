
import { useState, useEffect } from "react";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { 
  getContactMessages, 
  getContactMessageById, 
  updateContactMessage, 
  deleteContactMessage 
} from "@/utils/contactService";
import { ContactMessage } from "@/types";
import { toast } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";

const Messages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    const data = getContactMessages();
    setMessages(data);
  };

  const handleMarkAsRead = (id: string, isRead: boolean) => {
    const updatedMessage = updateContactMessage(id, { read: isRead });
    
    if (updatedMessage) {
      setMessages((prev) =>
        prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m))
      );
      toast.success(`Message marked as ${isRead ? "read" : "unread"}`);
    }
  };

  const handleDelete = () => {
    if (!selectedMessage) return;
    
    const success = deleteContactMessage(selectedMessage.id);
    
    if (success) {
      setMessages((prev) => prev.filter((m) => m.id !== selectedMessage.id));
      toast.success("Message deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedMessage(null);
    } else {
      toast.error("Failed to delete message");
    }
  };

  const openViewDialog = (message: ContactMessage) => {
    setSelectedMessage(message);
    
    // Mark as read if not already
    if (!message.read) {
      handleMarkAsRead(message.id, true);
    }
    
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contact Messages</h1>
      </div>

      <div className="glass-card rounded-xl p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No messages found. When visitors send you messages through the contact form, they will appear here.
                </TableCell>
              </TableRow>
            ) : (
              messages.map((message) => (
                <TableRow key={message.id} className={!message.read ? "bg-accent/30" : ""}>
                  <TableCell className="font-medium">{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>{message.subject}</TableCell>
                  <TableCell>{formatDate(message.createdAt)}</TableCell>
                  <TableCell>
                    {message.read ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        Read
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                        New
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <button
                      onClick={() => openViewDialog(message)}
                      className="btn-outline py-1 px-2"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteDialog(message)}
                      className="btn-outline py-1 px-2 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex justify-between text-sm">
              <div>
                <span className="font-medium">From:</span> {selectedMessage?.name} ({selectedMessage?.email})
              </div>
              <div className="text-muted-foreground">
                {selectedMessage && formatDate(selectedMessage.createdAt)}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <p className="whitespace-pre-wrap">{selectedMessage?.message}</p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              className="btn-outline flex items-center"
              onClick={() => {
                if (selectedMessage) {
                  handleMarkAsRead(
                    selectedMessage.id,
                    !selectedMessage.read
                  );
                  setSelectedMessage({
                    ...selectedMessage,
                    read: !selectedMessage.read,
                  });
                }
              }}
            >
              {selectedMessage?.read ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Mark as Unread
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Mark as Read
                </>
              )}
            </button>
            
            <button
              className="btn-primary"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              className="btn-outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;
