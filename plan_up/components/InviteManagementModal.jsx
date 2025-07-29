import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors.jsx';
import { useTheme } from '../hooks/useTheme';

export default function InviteManagementModal({ visible, onClose, organization, invites, onInviteAction }) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedInvite, setSelectedInvite] = useState(null);

  const handleInviteAction = async (invite, action) => {
    setSelectedInvite(invite);
    setActionType(action);
    setIsLoading(true);

    try {
      let result;
      if (action === 'accept') {
        result = await onInviteAction('accept', invite.id, organization.id);
      } else if (action === 'decline') {
        result = await onInviteAction('decline', invite.id, organization.id);
      } else if (action === 'cancel') {
        result = await onInviteAction('cancel', invite.id, organization.id);
      }

      if (result?.success) {
        Alert.alert(
          'Success',
          `Invite ${action === 'accept' ? 'accepted' : action === 'decline' ? 'declined' : 'cancelled'} successfully`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', `Failed to ${action} invite. Please try again.`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to ${action} invite. Please try again.`);
    } finally {
      setIsLoading(false);
      setActionType(null);
      setSelectedInvite(null);
    }
  };

  const handleCancelInvite = (invite) => {
    Alert.alert(
      'Cancel Invite',
      `Are you sure you want to cancel the invite sent to ${invite.email}?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', style: 'destructive', onPress: () => handleInviteAction(invite, 'cancel') }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return colors.blue;
      case 'accepted':
        return colors.coral;
      case 'declined':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'declined':
        return 'Declined';
      default:
        return 'Unknown';
    }
  };

  const renderInviteItem = ({ item }) => (
    <View style={[styles.inviteCard, { backgroundColor: colors.white, borderColor: colors.border }]}>
      <View style={styles.inviteHeader}>
        <View style={[styles.inviteAvatar, { backgroundColor: colors.blue }]}>
          <Text style={styles.inviteAvatarText}>
            {item.email.split('@')[0].charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.inviteInfo}>
          <Text style={[styles.inviteEmail, { color: colors.text }]}>{item.email}</Text>
          <Text style={[styles.inviteDate, { color: colors.textSecondary }]}>
            Invited {new Date(item.invitedAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.inviteDetails}>
        <Text style={[styles.inviteBy, { color: colors.textSecondary }]}>
          Invited by: {item.invitedBy}
        </Text>
      </View>

      {item.status === 'pending' && (
        <View style={styles.inviteActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.coral }]}
            onPress={() => handleInviteAction(item, 'accept')}
            disabled={isLoading && selectedInvite?.id === item.id && actionType === 'accept'}
          >
            {isLoading && selectedInvite?.id === item.id && actionType === 'accept' ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Accept</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: 'transparent', borderColor: colors.error }]}
            onPress={() => handleInviteAction(item, 'decline')}
            disabled={isLoading && selectedInvite?.id === item.id && actionType === 'decline'}
          >
            {isLoading && selectedInvite?.id === item.id && actionType === 'decline' ? (
              <ActivityIndicator color={colors.error} size="small" />
            ) : (
              <>
                <Ionicons name="close" size={16} color={colors.error} />
                <Text style={[styles.actionButtonText, { color: colors.error }]}>Decline</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: 'transparent', borderColor: colors.textSecondary }]}
            onPress={() => handleCancelInvite(item)}
            disabled={isLoading && selectedInvite?.id === item.id && actionType === 'cancel'}
          >
            {isLoading && selectedInvite?.id === item.id && actionType === 'cancel' ? (
              <ActivityIndicator color={colors.textSecondary} size="small" />
            ) : (
              <>
                <Ionicons name="trash" size={16} color={colors.textSecondary} />
                <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const pendingInvites = invites?.filter(invite => invite.status === 'pending') || [];
  const otherInvites = invites?.filter(invite => invite.status !== 'pending') || [];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Invite Management</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Organization Info */}
        <View style={[styles.orgInfoCard, { backgroundColor: colors.white, borderColor: colors.border }]}>
          <View style={[styles.orgAvatar, { backgroundColor: colors.coral }]}>
            <Ionicons name="business" size={24} color="#fff" />
          </View>
          <View style={styles.orgInfo}>
            <Text style={[styles.orgName, { color: colors.text }]}>{organization?.name}</Text>
            <Text style={[styles.orgMembers, { color: colors.textSecondary }]}>
              {organization?.members?.length || 0} member{(organization?.members?.length || 0) !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Invites List */}
        <View style={styles.content}>
          {pendingInvites.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Pending Invites</Text>
              <FlatList
                data={pendingInvites}
                renderItem={renderInviteItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.listContainer}
              />
            </View>
          )}

          {otherInvites.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Other Invites</Text>
              <FlatList
                data={otherInvites}
                renderItem={renderInviteItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.listContainer}
              />
            </View>
          )}

          {invites?.length === 0 && (
            <View style={[styles.emptyState, { backgroundColor: colors.white }]}>
              <Ionicons name="mail-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: colors.text }]}>No invites yet</Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                Send invites to team members to join your organization
              </Text>
            </View>
          )}
        </View>
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
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  orgInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    margin: 20,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContainer: {
    gap: 12,
  },
  inviteCard: {
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
  inviteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inviteAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inviteAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inviteInfo: {
    flex: 1,
  },
  inviteEmail: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  inviteDate: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inviteDetails: {
    marginBottom: 12,
  },
  inviteBy: {
    fontSize: 12,
  },
  inviteActions: {
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
    fontSize: 14,
    fontWeight: '600',
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
}); 