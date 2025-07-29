import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useOrganizationCustom } from './OrganizationContext';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors.jsx';
import EmailInviteModal from './EmailInviteModal';
import InviteManagementModal from './InviteManagementModal';
import { useTheme } from '../hooks/useTheme';

export default function OrganizationManagement() {
  const {
    organizations,
    myOrgs,
    currentOrg,
    setCurrentOrgId,
    createOrganization,
    joinOrganization,
    leaveOrganization,
    sendInvite,
    acceptInvite,
    declineInvite,
    cancelInvite,
    getPendingInvites,
  } = useOrganizationCustom();
  const [orgName, setOrgName] = useState('');
  const [joinId, setJoinId] = useState('');
  const [isEmailInviteModalVisible, setIsEmailInviteModalVisible] = useState(false);
  const [isInviteManagementModalVisible, setIsInviteManagementModalVisible] = useState(false);
  
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  // Loading state (simulate async if needed)
  if (!organizations) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.coral} />
        <Text style={{ marginTop: 16, color: colors.text, fontSize: 16 }}>Loading organizations...</Text>
      </View>
    );
  }

  const handleCreateOrg = () => {
    if (orgName.trim()) {
      createOrganization(orgName.trim());
      setOrgName('');
    } else {
      Alert.alert('Error', 'Please enter an organization name');
    }
  };

  const handleJoinOrg = () => {
    if (joinId.trim()) {
      joinOrganization(joinId.trim());
      setJoinId('');
    } else {
      Alert.alert('Error', 'Please enter an organization ID');
    }
  };

  const handleInviteAction = async (action, inviteId, orgId) => {
    try {
      let result;
      if (action === 'accept') {
        result = await acceptInvite(inviteId, orgId);
      } else if (action === 'decline') {
        result = await declineInvite(inviteId, orgId);
      } else if (action === 'cancel') {
        result = await cancelInvite(inviteId, orgId);
      }
      return result;
    } catch (error) {
      console.error('Invite action failed:', error);
      return { success: false, error: error.message };
    }
  };

  const handleLeaveOrg = (orgId, orgName) => {
    Alert.alert(
      'Leave Organization',
      `Are you sure you want to leave "${orgName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => leaveOrganization(orgId) }
      ]
    );
  };

  const renderOrgCard = ({ item }) => (
    <View style={[styles.orgCard, { backgroundColor: colors.white, borderColor: colors.border }]}>
      <View style={styles.orgHeader}>
        <View style={[styles.orgAvatar, { backgroundColor: colors.coral }]}>
          <Ionicons name="business" size={24} color="#fff" />
        </View>
        <View style={styles.orgInfo}>
          <Text style={[styles.orgName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.orgMembers, { color: colors.textSecondary }]}>
            {item.members.length} member{item.members.length !== 1 ? 's' : ''}
          </Text>
        </View>
        {currentOrg?.id === item.id && (
          <View style={[styles.activeBadge, { backgroundColor: colors.coral }]}>
            <Text style={styles.activeText}>Active</Text>
          </View>
        )}
      </View>
      
      <View style={styles.orgActions}>
        {currentOrg?.id !== item.id && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.blue, borderColor: colors.blue }]}
            onPress={() => setCurrentOrgId(item.id)}
          >
            <Ionicons name="swap-horizontal" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Switch</Text>
          </TouchableOpacity>
        )}

        {myOrgs.some(o => o.id === item.id) && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.coral, borderColor: colors.coral }]}
            onPress={() => setIsEmailInviteModalVisible(true)}
          >
            <Ionicons name="mail" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Invite</Text>
          </TouchableOpacity>
        )}
        
        {myOrgs.some(o => o.id === item.id) && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: 'transparent', borderColor: colors.error }]}
            onPress={() => handleLeaveOrg(item.id, item.name)}
          >
            <Ionicons name="exit" size={16} color={colors.error} />
            <Text style={[styles.actionButtonText, { color: colors.error }]}>Leave</Text>
          </TouchableOpacity>
        )}

        {myOrgs.some(o => o.id === item.id) && item.invites?.length > 0 && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: 'transparent', borderColor: colors.blue }]}
            onPress={() => setIsInviteManagementModalVisible(true)}
          >
            <Ionicons name="list" size={16} color={colors.blue} />
            <Text style={[styles.actionButtonText, { color: colors.blue }]}>Invites</Text>
          </TouchableOpacity>
        )}
        
        {!myOrgs.some(o => o.id === item.id) && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.coral, borderColor: colors.coral }]}
            onPress={() => joinOrganization(item.id)}
          >
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Join</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderMemberCard = ({ item }) => (
    <View style={[styles.memberCard, { backgroundColor: colors.white, borderColor: colors.border }]}>
      <View style={[styles.memberAvatar, { backgroundColor: colors.blue }]}>
        <Text style={styles.memberAvatarText}>
          {item.split('@')[0].charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={[styles.memberName, { color: colors.text }]}>{item}</Text>
        <Text style={[styles.memberRole, { color: colors.textSecondary }]}>Member</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Organization Management</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Manage your organizations and team members
        </Text>
      </View>

      {/* My Organizations */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>My Organizations</Text>
        {myOrgs.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.white }]}>
            <Ionicons name="business-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyStateText, { color: colors.text }]}>No organizations yet</Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
              Create or join an organization to get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={myOrgs}
            keyExtractor={org => org.id}
            renderItem={renderOrgCard}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>

      {/* Create Organization */}
      <View style={[styles.section, { backgroundColor: colors.white }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Create Organization</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background, 
              borderColor: colors.border, 
              color: colors.text 
            }]}
            placeholder="Organization name"
            placeholderTextColor={colors.textSecondary}
            value={orgName}
            onChangeText={setOrgName}
          />
          <TouchableOpacity 
            style={[styles.createButton, { backgroundColor: colors.coral }]}
            onPress={handleCreateOrg}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Join Organization */}
      <View style={[styles.section, { backgroundColor: colors.white }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Join Organization</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background, 
              borderColor: colors.border, 
              color: colors.text 
            }]}
            placeholder="Organization ID"
            placeholderTextColor={colors.textSecondary}
            value={joinId}
            onChangeText={setJoinId}
          />
          <TouchableOpacity 
            style={[styles.joinButton, { backgroundColor: colors.blue }]}
            onPress={handleJoinOrg}
          >
            <Ionicons name="enter" size={20} color="#fff" />
            <Text style={styles.joinButtonText}>Join</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* All Organizations */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>All Organizations</Text>
        <FlatList
          data={organizations}
          keyExtractor={org => org.id}
          renderItem={renderOrgCard}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      {/* Current Organization Members */}
      {currentOrg && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Members of {currentOrg.name}
          </Text>
          <FlatList
            data={currentOrg.members}
            keyExtractor={email => email}
            renderItem={renderMemberCard}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}

      {/* Email Invite Modal */}
      <EmailInviteModal
        visible={isEmailInviteModalVisible}
        onClose={() => setIsEmailInviteModalVisible(false)}
        organization={currentOrg}
        onInviteSent={(email) => {
          console.log(`Invite sent to ${email}`);
        }}
      />

      {/* Invite Management Modal */}
      <InviteManagementModal
        visible={isInviteManagementModalVisible}
        onClose={() => setIsInviteManagementModalVisible(false)}
        organization={currentOrg}
        invites={currentOrg?.invites || []}
        onInviteAction={handleInviteAction}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyState: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  listContainer: {
    gap: 12,
  },
  orgCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  orgAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orgInfo: {
    flex: 1,
  },
  orgName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orgMembers: {
    fontSize: 14,
  },
  activeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  orgActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 14,
  },
}); 