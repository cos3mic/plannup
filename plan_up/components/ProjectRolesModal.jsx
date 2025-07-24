import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors.jsx';

const defaultRoles = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full access to all project features',
    icon: 'shield',
    color: '#FF6B6B',
    permissions: [
      'manage-project',
      'manage-users',
      'manage-roles',
      'create-issues',
      'edit-issues',
      'delete-issues',
      'manage-sprints',
      'view-reports',
      'manage-templates',
      'bulk-operations',
    ],
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Can work on issues and update progress',
    icon: 'code',
    color: '#4ECDC4',
    permissions: [
      'create-issues',
      'edit-issues',
      'view-reports',
      'manage-sprints',
    ],
  },
  {
    id: 'reporter',
    name: 'Reporter',
    description: 'Can create and view issues',
    icon: 'document',
    color: '#45B7D1',
    permissions: [
      'create-issues',
      'view-reports',
    ],
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to project',
    icon: 'eye',
    color: '#9E9E9E',
    permissions: [
      'view-reports',
    ],
  },
];

const allPermissions = [
  { key: 'manage-project', label: 'Manage Project Settings', description: 'Change project configuration' },
  { key: 'manage-users', label: 'Manage Users', description: 'Add/remove project members' },
  { key: 'manage-roles', label: 'Manage Roles', description: 'Create and assign roles' },
  { key: 'create-issues', label: 'Create Issues', description: 'Create new issues' },
  { key: 'edit-issues', label: 'Edit Issues', description: 'Modify existing issues' },
  { key: 'delete-issues', label: 'Delete Issues', description: 'Remove issues from project' },
  { key: 'manage-sprints', label: 'Manage Sprints', description: 'Create and manage sprints' },
  { key: 'view-reports', label: 'View Reports', description: 'Access project reports' },
  { key: 'manage-templates', label: 'Manage Templates', description: 'Create and edit issue templates' },
  { key: 'bulk-operations', label: 'Bulk Operations', description: 'Perform bulk actions on issues' },
];

export default function ProjectRolesModal({ 
  visible, 
  onClose, 
  onSaveRole,
  onDeleteRole,
  onAssignRole,
  projectMembers = [],
  customRoles = []
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [activeTab, setActiveTab] = useState('roles');
  const [selectedRole, setSelectedRole] = useState(null);
  const [showRoleDetails, setShowRoleDetails] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Create role form state
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    icon: 'person',
    color: '#4CAF50',
    permissions: [],
  });

  const tabs = [
    { key: 'roles', label: 'Roles', icon: 'shield' },
    { key: 'members', label: 'Members', icon: 'people' },
  ];

  const allRoles = [...defaultRoles, ...customRoles];

  const handleSaveRole = async () => {
    if (!newRole.name.trim()) {
      Alert.alert('Error', 'Please enter a role name');
      return;
    }

    setIsLoading(true);
    try {
      const roleToSave = {
        ...newRole,
        id: Date.now().toString(),
      };
      
      await onSaveRole(roleToSave);
      setShowCreateForm(false);
      setNewRole({
        name: '',
        description: '',
        icon: 'person',
        color: '#4CAF50',
        permissions: [],
      });
      Alert.alert('Success', 'Role saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save role');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRole = (role) => {
    if (defaultRoles.find(r => r.id === role.id)) {
      Alert.alert('Error', 'Cannot delete default roles');
      return;
    }

    Alert.alert(
      'Delete Role',
      `Are you sure you want to delete "${role.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDeleteRole(role.id)
        },
      ]
    );
  };

  const handleAssignRole = async (memberId, roleId) => {
    setIsLoading(true);
    try {
      await onAssignRole(memberId, roleId);
      Alert.alert('Success', 'Role assigned successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to assign role');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePermission = (permissionKey) => {
    const currentPermissions = newRole.permissions;
    const newPermissions = currentPermissions.includes(permissionKey)
      ? currentPermissions.filter(p => p !== permissionKey)
      : [...currentPermissions, permissionKey];
    
    setNewRole({ ...newRole, permissions: newPermissions });
  };

  const renderRole = ({ item }) => (
    <TouchableOpacity
      style={[styles.roleCard, { backgroundColor: colors.white }]}
      onPress={() => {
        setSelectedRole(item);
        setShowRoleDetails(true);
      }}
    >
      <View style={styles.roleHeader}>
        <View style={[styles.roleIcon, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon} size={20} color="#fff" />
        </View>
        <View style={styles.roleInfo}>
          <Text style={[styles.roleName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.roleDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
          <Text style={[styles.rolePermissions, { color: colors.textSecondary }]}>
            {item.permissions.length} permissions
          </Text>
        </View>
        <View style={styles.roleActions}>
          {!defaultRoles.find(r => r.id === item.id) && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteRole(item)}
            >
              <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMember = ({ item }) => (
    <View style={[styles.memberCard, { backgroundColor: colors.white }]}>
      <View style={styles.memberHeader}>
        <View style={[styles.memberAvatar, { backgroundColor: colors.coral }]}>
          <Text style={styles.memberInitial}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.memberInfo}>
          <Text style={[styles.memberName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.memberEmail, { color: colors.textSecondary }]}>
            {item.email}
          </Text>
          <View style={styles.memberRole}>
            <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.roleId) + '20' }]}>
              <Text style={[styles.roleBadgeText, { color: getRoleColor(item.roleId) }]}>
                {getRoleName(item.roleId)}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.assignButton, { backgroundColor: colors.coral }]}
          onPress={() => {
            Alert.alert(
              'Assign Role',
              'Select a role for this member:',
              allRoles.map(role => ({
                text: role.name,
                onPress: () => handleAssignRole(item.id, role.id)
              }))
            );
          }}
        >
          <Text style={styles.assignButtonText}>Change</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRoleDetails = () => {
    if (!selectedRole) return null;

    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailsHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowRoleDetails(false)}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
            <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
          </TouchableOpacity>
          <Text style={[styles.detailsTitle, { color: colors.text }]}>
            Role Details
          </Text>
        </View>

        <ScrollView style={styles.detailsContent}>
          {/* Role Info */}
          <View style={[styles.detailCard, { backgroundColor: colors.white }]}>
            <View style={styles.detailHeader}>
              <View style={[styles.detailIcon, { backgroundColor: selectedRole.color }]}>
                <Ionicons name={selectedRole.icon} size={24} color="#fff" />
              </View>
              <View style={styles.detailInfo}>
                <Text style={[styles.detailName, { color: colors.text }]}>
                  {selectedRole.name}
                </Text>
                <Text style={[styles.detailDescription, { color: colors.textSecondary }]}>
                  {selectedRole.description}
                </Text>
              </View>
            </View>
          </View>

          {/* Permissions */}
          <View style={styles.permissionsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Permissions ({selectedRole.permissions.length})
            </Text>
            {selectedRole.permissions.map(permissionKey => {
              const permission = allPermissions.find(p => p.key === permissionKey);
              return (
                <View key={permissionKey} style={[styles.permissionCard, { backgroundColor: colors.white }]}>
                  <View style={styles.permissionHeader}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.coral} />
                    <View style={styles.permissionInfo}>
                      <Text style={[styles.permissionLabel, { color: colors.text }]}>
                        {permission?.label || permissionKey}
                      </Text>
                      <Text style={[styles.permissionDescription, { color: colors.textSecondary }]}>
                        {permission?.description || 'Permission description'}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Members with this role */}
          <View style={styles.membersSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Members with this role
            </Text>
            {projectMembers.filter(member => member.roleId === selectedRole.id).map(member => (
              <View key={member.id} style={[styles.memberItem, { backgroundColor: colors.white }]}>
                <View style={[styles.memberAvatar, { backgroundColor: colors.coral }]}>
                  <Text style={styles.memberInitial}>
                    {member.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={[styles.memberName, { color: colors.text }]}>
                    {member.name}
                  </Text>
                  <Text style={[styles.memberEmail, { color: colors.textSecondary }]}>
                    {member.email}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderCreateForm = () => (
    <View style={styles.createContainer}>
      <View style={styles.createHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowCreateForm(false)}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
          <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.createTitle, { color: colors.text }]}>
          Create Role
        </Text>
      </View>

      <ScrollView style={styles.createContent}>
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Role Information
          </Text>
          
          <View style={[styles.inputCard, { backgroundColor: colors.white }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Role Name
            </Text>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              value={newRole.name}
              onChangeText={(text) => setNewRole({ ...newRole, name: text })}
              placeholder="Enter role name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={[styles.inputCard, { backgroundColor: colors.white }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Description
            </Text>
            <TextInput
              style={[styles.textArea, { color: colors.text }]}
              value={newRole.description}
              onChangeText={(text) => setNewRole({ ...newRole, description: text })}
              placeholder="Describe this role"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Permissions
          </Text>
          {allPermissions.map(permission => (
            <TouchableOpacity
              key={permission.key}
              style={[styles.permissionCard, { backgroundColor: colors.white }]}
              onPress={() => togglePermission(permission.key)}
            >
              <View style={styles.permissionHeader}>
                <View style={[
                  styles.permissionCheckbox,
                  {
                    backgroundColor: newRole.permissions.includes(permission.key) ? colors.coral : 'transparent',
                    borderColor: newRole.permissions.includes(permission.key) ? colors.coral : colors.border,
                  }
                ]}>
                  {newRole.permissions.includes(permission.key) && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <View style={styles.permissionInfo}>
                  <Text style={[styles.permissionLabel, { color: colors.text }]}>
                    {permission.label}
                  </Text>
                  <Text style={[styles.permissionDescription, { color: colors.textSecondary }]}>
                    {permission.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.coral }]}
          onPress={handleSaveRole}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>
              Save Role
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const getRoleColor = (roleId) => {
    const role = allRoles.find(r => r.id === roleId);
    return role?.color || '#9E9E9E';
  };

  const getRoleName = (roleId) => {
    const role = allRoles.find(r => r.id === roleId);
    return role?.name || 'Unknown';
  };

  if (showRoleDetails) {
    return renderRoleDetails();
  }

  if (showCreateForm) {
    return renderCreateForm();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Project Roles & Permissions
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  {
                    backgroundColor: activeTab === tab.key ? colors.coral : colors.white,
                    borderColor: activeTab === tab.key ? colors.coral : colors.border,
                  },
                ]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Ionicons 
                  name={tab.icon} 
                  size={18} 
                  color={activeTab === tab.key ? '#fff' : colors.textSecondary} 
                />
                <Text style={[
                  styles.tabText,
                  { color: activeTab === tab.key ? '#fff' : colors.text }
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {activeTab === 'roles' && (
            <TouchableOpacity
              style={[styles.createTabButton, { backgroundColor: colors.blue }]}
              onPress={() => setShowCreateForm(true)}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.createTabButtonText}>Create</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.content}>
          {activeTab === 'roles' ? (
            <FlatList
              data={allRoles}
              renderItem={renderRole}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <FlatList
              data={projectMembers}
              renderItem={renderMember}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  createTabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  createTabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  roleCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  roleInfo: {
    flex: 1,
  },
  roleName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  roleDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  rolePermissions: {
    fontSize: 12,
  },
  roleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
  memberCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  memberRole: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  assignButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  assignButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  detailsContainer: {
    flex: 1,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  detailsContent: {
    flex: 1,
    padding: 20,
  },
  detailCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailInfo: {
    flex: 1,
  },
  detailName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailDescription: {
    fontSize: 14,
  },
  permissionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  permissionCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionInfo: {
    flex: 1,
  },
  permissionLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  permissionDescription: {
    fontSize: 12,
  },
  membersSection: {
    marginBottom: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  createContainer: {
    flex: 1,
  },
  createHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  createTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  createContent: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  inputCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  textInput: {
    fontSize: 16,
  },
  textArea: {
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
}); 