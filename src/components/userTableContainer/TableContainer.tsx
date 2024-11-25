'use client';

import { useEffect, useState, useMemo } from 'react';
import CustomDataTable from './CustomTable';
import axios from 'axios';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { EyeIcon, EyeOffIcon, Plus, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Users } from '@/types';
import { Label } from '../ui/label';
import { debounce } from 'lodash';

export default function TableContainer() {
  const { toast } = useToast();

  const [userList, setUserList] = useState<Users[]>([]);
  const [showSingleAdd, setShowSingleAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [userDetails, setUserDetails] = useState<Users | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [addUserData, setAddUserData] = useState<Users>({
    _id: '',
    name: '',
    username: '',
    password: '',
    userType: '',
  });
  const [editFormData, setEditFormData] = useState<Users>({
    _id: '',
    name: '',
    username: '',
    password: '',
    userType: '',
  });
  // const [imageFile, setImageFile] = useState<File | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Users | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [changePassword, setChangePassword] = useState<boolean>(false);

  const refreshData = () => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/auth/users?search=${searchQuery}`,
        );
        setUserList(response.data);
      } catch (error) {
        console.error(error);
        setUserList([]);
      }
    };

    fetchStudents();
  };

  const handleSingleAdd = () => {
    setShowSingleAdd(true);
  };

  const handleView = (user: Users) => {
    setUserDetails(user);
    setShowView(true);
  };

  const handleEdit = (user: Users) => {
    setUserDetails(user);
    setShowEdit(true);
  };

  const handleDelete = (user: Users) => {
    setUserToDelete(user);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/auth/users/${userToDelete._id}`,
      );
      if (response.data) {
        toast({
          title: 'Success',
          description: 'User deleted successfully!',
          variant: 'default',
          duration: 3000,
        });
        setShowDeleteConfirmation(false);
        setUserToDelete(null);
      }
      refreshData();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
      refreshData();
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/auth/register`,
        {
          name: addUserData.name,
          username: addUserData.username,
          password: addUserData.password,
          userType: 'Admin',
        },
      );

      if (response) {
        toast({
          title: 'Success',
          description: 'User added successfully',
          variant: 'default',
          duration: 3000,
        });

        setAddUserData({
          _id: '',
          name: '',
          username: '',
          password: '',
          userType: '',
        });
        setConfirmPassword('');
        setShowPassword(false);
        setShowConfirmPassword(false);
        setShowSingleAdd(false);
        refreshData();
      }
    } catch (err: any) {
      console.error('API error:', err);
      const errorMessage = err.response?.data.message || 'Something went wrong';

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  // Edit Submit
  const handleEditSubmit = async () => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API}/auth/users/${editFormData._id}`,
        {
          name: editFormData.name,
          username: editFormData.username,
          password: editFormData.password,
          userType: 'Admin',
        },
      );

      if (response.data) {
        toast({
          title: 'Success',
          description: 'User information updated successfully!',
          variant: 'default',
          duration: 3000,
        });
        setShowEdit(false);
        setEditFormData({
          _id: '',
          name: '',
          username: '',
          password: '',
          userType: '',
        });
        setConfirmPassword('');
        setShowPassword(false);
        setShowConfirmPassword(false);
        setChangePassword(false);
        refreshData(); // Refresh the table data
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: `${error.response.data.message}`,
        variant: 'destructive',
        duration: 5000,
      });
    }
  };

  const handleCloseDialog = () => {
    setShowSingleAdd(false);
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleCloseEditDialog = () => {
    setShowEdit(false);
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/auth/users?searchQuery=${searchQuery}`,
        );
        setUserList(response.data);
        if (searchQuery) {
          setCurrentPage(1);
        }
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Error fetching users. Please try again.',
          variant: 'destructive',
          duration: 3000,
        });
      }
    };

    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, currentPage]);

  useEffect(() => {
    if (userDetails) {
      setEditFormData({
        _id: userDetails._id,
        name: userDetails.name,
        username: userDetails.username,
        userType: 'Admin',
      });
    }
  }, [userDetails]);

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setSearchQuery(query);
      }, 500),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <Card className="container mx-auto p-6">
      <h1 className="text-2xl text-center font-semibold mb-12">Users</h1>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
        <div className="relative max-w-md w-full">
          <Input
            type="text"
            placeholder="Search User..."
            className="pr-10"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSingleAdd}
            className="flex-grow md:flex-grow-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Table component */}
      <CustomDataTable
        data={userList}
        itemsPerPage={10}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add Dialog */}
      <Dialog open={showSingleAdd} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[450px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Please fill in the details below to add a new user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-5 items-center gap-2 mx-4">
              <Label htmlFor="name" className="text-right col-span-2">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                onChange={(e) =>
                  setAddUserData({
                    ...addUserData,
                    name: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-5 items-center gap-2 mx-4">
              <Label htmlFor="username" className="text-right col-span-2">
                Username
              </Label>
              <Input
                id="username"
                className="col-span-3"
                onChange={(e) =>
                  setAddUserData({
                    ...addUserData,
                    username: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-5 items-center gap-2 mx-4">
              <Label htmlFor="password" className="text-right col-span-2">
                Password
              </Label>
              <div className="relative col-span-3">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="h-10 w-full"
                  onChange={(e) =>
                    setAddUserData({
                      ...addUserData,
                      password: e.target.value,
                    })
                  }
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeIcon className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {showPassword ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-5 items-center gap-2 mx-4">
              <Label
                htmlFor="confirm-password"
                className="text-right col-span-2"
              >
                Confirm Password
              </Label>
              <div className="relative col-span-3">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="h-10 w-full"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeIcon className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              className="border-destructive text-destructive flex-grow md:flex-grow-0 hover:bg-destructive hover:text-white"
            >
              Cancel
            </Button>
            <Button
              disabled={confirmPassword !== addUserData.password}
              onClick={handleAddUser}
            >
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showView} onOpenChange={setShowView}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View user details.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-center gap-8">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <p className="font-semibold">Name:</p>
                <p>{userDetails?.name ?? 'N/A'}</p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Username:</p>
                  <p>{userDetails?.username ?? 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <p className="font-semibold">User Type:</p>
                <p>{userDetails?.userType ?? 'N/A'}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User Information</DialogTitle>
            <DialogDescription>
              Make changes to the user&apos;s information here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {changePassword ? (
              <>
                <div className="grid grid-cols-5 items-center gap-2">
                  <Label htmlFor="password" className="text-right col-span-2">
                    Password
                  </Label>
                  <div className="relative col-span-3">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      className="h-10 w-full"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeIcon className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {showPassword ? 'Hide password' : 'Show password'}
                      </span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-5 items-center gap-2">
                  <Label
                    htmlFor="confirm-password"
                    className="text-right col-span-2"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative col-span-3">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      className="h-10 w-full"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeIcon className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {showConfirmPassword
                          ? 'Hide password'
                          : 'Show password'}
                      </span>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-5 items-center gap-4">
                  <Label htmlFor="name" className="text-right col-span-2">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={editFormData.name ?? 'N/A'}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-5 items-center gap-4">
                  <Label htmlFor="username" className="text-right col-span-2">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={editFormData.username ?? 'N/A'}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        username: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            {!changePassword ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCloseEditDialog}
                  className="border-destructive text-destructive flex-grow md:flex-grow-0 hover:bg-destructive hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setChangePassword(true)}
                >
                  Change Password
                </Button>
                <Button onClick={handleEditSubmit}>Save changes</Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setChangePassword(false)}
                  className="border-destructive text-destructive flex-grow md:flex-grow-0 hover:bg-destructive hover:text-white"
                >
                  Back
                </Button>
                <Button onClick={handleEditSubmit}>Confirm</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* delete confirmation dialog */}
      <Dialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-sm">
            Are you sure you want to delete {userToDelete?.name ?? 'User'}? This
            action cannot be undone.
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirmation(false)}
              className="border-destructive text-destructive flex-grow md:flex-grow-0 hover:bg-destructive hover:text-white"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
